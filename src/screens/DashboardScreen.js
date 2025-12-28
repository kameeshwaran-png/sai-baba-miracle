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
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, limit, getDocs, startAfter, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTheme } from '../hooks/useTheme';
import FeedCard from '../components/FeedCard';

const POSTS_PER_PAGE = 10;

export default function DashboardScreen({ navigation }) {
  const { colors } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      const postsData = [];

      for (const docSnap of snapshot.docs) {
        const postData = { id: docSnap.id, ...docSnap.data() };
        
        // Fetch author name if not included
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

        postsData.push(postData);
      }

      setPosts(postsData);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore || !lastVisible) return;

    try {
      setLoadingMore(true);

      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(POSTS_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      const newPosts = [];

      for (const docSnap of snapshot.docs) {
        const postData = { id: docSnap.id, ...docSnap.data() };
        
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

        newPosts.push(postData);
      }

      setPosts([...posts, ...newPosts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadPosts(true);
  }, []);

  const handleCreatePost = () => {
    // Navigate to create post screen (to be implemented)
    Alert.alert('Create Post', 'Create post screen coming soon!');
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          Sai Baba
        </Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.accent }]}
          onPress={handleCreatePost}
        >
          <Ionicons name="create-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : undefined}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontFamily: 'System',
  },
  emptyList: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

