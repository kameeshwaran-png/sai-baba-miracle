import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, limit, getDocs, startAfter, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTheme } from '../hooks/useTheme';
import FeedCard from '../components/FeedCard';


const POSTS_PER_PAGE = 15;

export default function DashboardScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const preferredLanguage = useSelector((state) => state.theme.language) || 'en';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingPreferredLanguage, setFetchingPreferredLanguage] = useState(true); // Track if we're still fetching preferred language posts

  const fetchAuthorInfo = async (postData) => {
    if (postData.authorId && !postData.authorName) {
      try {
        const userDoc = await getDoc(doc(db, 'users', postData.authorId));
        if (userDoc.exists()) {
          postData.authorName = userDoc.data().displayName || 'Anonymous';
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    }
    // Ensure default values
    postData.likeCount = postData.likeCount || 0;
    postData.commentCount = postData.commentCount || 0;
    postData.likedBy = postData.likedBy || [];
    return postData;
  };

  const loadPosts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const postsRef = collection(db, 'posts');
      let shouldFetchPreferred = isRefresh ? true : fetchingPreferredLanguage;

      // Fetch all posts and filter client-side to avoid index requirement
      // This approach prioritizes preferred language posts while avoiding composite index needs
      const q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE * 3) // Fetch more to filter preferred language posts
      );

      const snapshot = await getDocs(q);
      const allPostsData = [];
      const existingPostIds = new Set();

      // Process all fetched posts
      for (const docSnap of snapshot.docs) {
        const postData = { id: docSnap.id, ...docSnap.data() };
        await fetchAuthorInfo(postData);
        if (!existingPostIds.has(postData.id)) {
          allPostsData.push(postData);
          existingPostIds.add(postData.id);
        }
      }

      let postsData = [];

      // If we should prioritize preferred language, filter and sort
      if (shouldFetchPreferred && preferredLanguage) {
        // Separate preferred language posts and others
        const preferredPosts = allPostsData.filter(p => p.language === preferredLanguage);
        const otherPosts = allPostsData.filter(p => p.language !== preferredLanguage);

        // Combine: preferred first, then others
        postsData = [...preferredPosts, ...otherPosts].slice(0, POSTS_PER_PAGE);

        // If we got fewer preferred language posts than requested, switch mode
        if (preferredPosts.length < POSTS_PER_PAGE) {
          setFetchingPreferredLanguage(false);
        } else if (postsData.length === POSTS_PER_PAGE && preferredPosts.length >= POSTS_PER_PAGE) {
          setFetchingPreferredLanguage(true);
        } else {
          setFetchingPreferredLanguage(false);
        }
      } else {
        // Use all posts as-is
        postsData = allPostsData.slice(0, POSTS_PER_PAGE);
        setFetchingPreferredLanguage(false);
      }

      // Set last visible based on the actual posts we're showing
      if (snapshot.docs.length > 0) {
        // Find the last visible doc that corresponds to our filtered posts
        const lastPostId = postsData[postsData.length - 1]?.id;
        const lastDoc = snapshot.docs.find(doc => doc.id === lastPostId) || snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastDoc || null);
      } else {
        setLastVisible(null);
      }

      setPosts(postsData);
      setHasMore(snapshot.docs.length >= POSTS_PER_PAGE * 3 && postsData.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again.');
      setHasMore(false);
      setFetchingPreferredLanguage(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [preferredLanguage, fetchingPreferredLanguage]);

  useEffect(() => {
    // Reset and reload when preferred language changes
    setPosts([]);
    setFetchingPreferredLanguage(true);
    setLastVisible(null);
    setHasMore(true);
    setLoading(true);
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredLanguage]);

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore || !lastVisible) return;

    try {
      setLoadingMore(true);

      const postsRef = collection(db, 'posts');
      const existingPostIds = new Set(posts.map(p => p.id));

      // Fetch more posts using cursor (no index needed for this query)
      const q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(POSTS_PER_PAGE * 3) // Fetch more to filter preferred language posts
      );

      const snapshot = await getDocs(q);
      const allNewPosts = [];

      // Process all fetched posts
      for (const docSnap of snapshot.docs) {
        const postData = { id: docSnap.id, ...docSnap.data() };
        
        // Skip duplicates
        if (existingPostIds.has(postData.id)) continue;
        
        await fetchAuthorInfo(postData);
        allNewPosts.push(postData);
        existingPostIds.add(postData.id);
      }

      let newPosts = [];

      // If we should prioritize preferred language, filter accordingly
      if (fetchingPreferredLanguage && preferredLanguage) {
        // Separate preferred language posts and others
        const preferredPosts = allNewPosts.filter(p => p.language === preferredLanguage);
        const otherPosts = allNewPosts.filter(p => p.language !== preferredLanguage);

        // Combine: preferred first, then others
        newPosts = [...preferredPosts, ...otherPosts].slice(0, POSTS_PER_PAGE);

        // If we got fewer preferred language posts, switch mode for next fetch
        if (preferredPosts.length < POSTS_PER_PAGE) {
          setFetchingPreferredLanguage(false);
        }
      } else {
        // Use all posts as-is
        newPosts = allNewPosts.slice(0, POSTS_PER_PAGE);
      }

      // Update last visible
      if (snapshot.docs.length > 0) {
        const lastPostId = newPosts[newPosts.length - 1]?.id;
        const lastDoc = snapshot.docs.find(doc => doc.id === lastPostId) || snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastDoc || null);
      } else {
        setLastVisible(null);
      }

      if (newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
      
      setHasMore(snapshot.docs.length >= POSTS_PER_PAGE * 3 && newPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadPosts(true);
  }, [loadPosts]);

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderHeader = () => {
    const successColor = mode === 'dark' ? '#32D74B' : '#34C759';
    
    return (
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.headerProfileImage}
              />
            ) : (
              <View style={[styles.headerProfileImagePlaceholder, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="person" size={20} color={colors.accent} />
              </View>
            )}
            <View style={styles.headerTitleWrapper}>
              <Text style={[styles.headerTitleMain, { color: colors.primary }]}>
                Sai Baba
              </Text>
              <Text style={[styles.headerTitleSubtitle, { color: colors.secondary }]}>
                Miracles
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePost}
          >
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPost = ({ item }) => (
    <FeedCard
      post={item}
      navigation={navigation}
      onPress={() => navigation.navigate('Details', { postId: item.id })}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={colors.secondary} />
      <Text style={[styles.emptyText, { color: colors.secondary }]}>
        No posts yet. Be the first to share!
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerProfileImagePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrapper: {
    flexShrink: 1,
  },
  headerTitleMain: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  headerTitleSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.7,
    marginTop: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  emptyList: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});



