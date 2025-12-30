import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, updateDoc, increment, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTheme } from '../hooks/useTheme';

export default function DetailsScreen({ route, navigation }) {
  const { postId } = route.params;
  const { colors } = useTheme();
  const userId = useSelector((state) => state.auth.user?.uid);
  const user = useSelector((state) => state.auth.user);
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        const postData = { id: postDoc.id, ...postDoc.data() };
        setPost(postData);
        setLikeCount(postData.likeCount || 0);
        
        if (postData.likedBy && userId) {
          setLiked(postData.likedBy.includes(userId));
        }

        // Fetch author name if needed
        if (postData.authorId && !postData.authorName) {
          try {
            const userDoc = await getDoc(doc(db, 'users', postData.authorId));
            if (userDoc.exists()) {
              postData.authorName = userDoc.data().displayName || 'Anonymous';
              setPost(postData);
            }
          } catch (error) {
            console.error('Error fetching author:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
      Alert.alert('Error', 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      
      const commentsData = [];
      for (const commentDoc of snapshot.docs) {
        const commentData = { id: commentDoc.id, ...commentDoc.data() };
        
        // Fetch commenter name
        if (commentData.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', commentData.userId));
            if (userDoc.exists()) {
              commentData.userName = userDoc.data().displayName || 'Anonymous';
            }
          } catch (error) {
            console.error('Error fetching commenter:', error);
          }
        }
        
        commentsData.push(commentData);
      }
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (!userId) {
      Alert.alert('Login Required', 'Please login to like posts');
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      const newLiked = !liked;

      if (newLiked) {
        await updateDoc(postRef, {
          likedBy: arrayUnion(userId),
          likeCount: increment(1),
        });
        setLikeCount(likeCount + 1);
      } else {
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
          likeCount: increment(-1),
        });
        setLikeCount(Math.max(0, likeCount - 1));
      }

      setLiked(newLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    if (!userId) {
      Alert.alert('Login Required', 'Please login to comment');
      return;
    }

    try {
      setSubmittingComment(true);
      const commentsRef = collection(db, 'posts', postId, 'comments');
      
      await addDoc(commentsRef, {
        text: commentText.trim(),
        userId: userId,
        userName: user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
        createdAt: serverTimestamp(),
      });

      // Update comment count
      await updateDoc(doc(db, 'posts', postId), {
        commentCount: increment(1),
      });

      setCommentText('');
      loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={[styles.title, { color: colors.primary }]}>
            {post.title}
          </Text>

          {/* Content */}
          <Text style={[styles.content, { color: colors.secondary }]}>
            {post.content}
          </Text>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={[styles.commentsTitle, { color: colors.primary }]}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </Text>

            {comments.map((comment) => (
              <View
                key={comment.id}
                style={styles.commentItem}
              >
                <View style={styles.commentHeader}>
                  <View style={[styles.commentAvatar, { backgroundColor: colors.accent + '20' }]}>
                    <Text style={[styles.commentAvatarText, { color: colors.accent }]}>
                      {(comment.userName || 'A')[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={[styles.commentAuthor, { color: colors.primary }]}>
                      {comment.userName || 'Anonymous'}
                    </Text>
                    <Text style={[styles.commentText, { color: colors.secondary }]}>
                      {comment.text}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {comments.length === 0 && (
              <Text style={[styles.noComments, { color: colors.secondary }]}>
                No comments yet. Be the first to comment!
              </Text>
            )}
          </View>

          {/* Spacer for bottom input */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* YouTube-Style Comment Input Overlay */}
        <View style={styles.commentInputWrapper}>
          <BlurView
            intensity={80}
            tint={colors.background === '#000000' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[styles.commentInputContainer, { backgroundColor: colors.surface + 'F0' }]}>
            <View style={[styles.commentInputBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                style={[styles.commentInput, { color: colors.primary }]}
                placeholder="Write a comment..."
                placeholderTextColor={colors.secondary}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: commentText.trim() ? colors.accent : colors.border }]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || submittingComment}
                activeOpacity={0.7}
              >
                {submittingComment ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Ionicons name="send" size={20} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Close Button - Bottom Center */}
        <View style={styles.closeButtonWrapper}>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surface + 'F0' }]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <BlurView
              intensity={60}
              tint={colors.background === '#000000' ? 'dark' : 'light'}
              style={StyleSheet.absoluteFillObject}
            />
            <Ionicons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 180, // Space for comment input and close button
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
    lineHeight: 40,
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  commentItem: {
    marginBottom: 20,
  },
  commentHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  noComments: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  bottomSpacer: {
    height: 20,
  },
  commentInputWrapper: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentInputContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  commentInputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
});
