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
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTheme } from '../hooks/useTheme';

export default function DetailsScreen({ route, navigation }) {
  const { postId } = route.params;
  const { colors } = useTheme();
  const userId = useSelector((state) => state.auth.user?.uid);
  const userRole = useSelector((state) => state.auth.userRole);
  
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
        createdAt: new Date(),
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

  const handleDeletePost = () => {
    if (userRole !== 'admin') return;

    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { deleteDoc } = await import('firebase/firestore');
              await deleteDoc(doc(db, 'posts', postId));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin Delete Button */}
        {userRole === 'admin' && (
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={handleDeletePost}
          >
            <Ionicons name="trash-outline" size={20} color="#ffffff" />
            <Text style={styles.deleteButtonText}>Delete Post</Text>
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={[styles.title, { color: colors.primary }]}>
          {post.title}
        </Text>

        {/* Meta Info */}
        <View style={styles.meta}>
          <Text style={[styles.metaText, { color: colors.secondary }]}>
            {post.authorName || 'Anonymous'} • {post.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
          </Text>
        </View>

        {/* Like Count */}
        <TouchableOpacity
          style={[styles.likeContainer, { borderColor: colors.border }]}
          onPress={handleLike}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={28}
            color={liked ? colors.error : colors.secondary}
          />
          <Text style={[styles.likeCount, { color: colors.primary }]}>
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </Text>
        </TouchableOpacity>

        {/* Content */}
        <Text style={[styles.content, { color: colors.secondary }]}>
          {post.content}
        </Text>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={[styles.commentsTitle, { color: colors.primary }]}>
            Comments ({comments.length})
          </Text>

          {comments.map((comment) => (
            <View
              key={comment.id}
              style={[styles.commentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.commentAuthor, { color: colors.primary }]}>
                {comment.userName || 'Anonymous'}
              </Text>
              <Text style={[styles.commentText, { color: colors.secondary }]}>
                {comment.text}
              </Text>
              <Text style={[styles.commentDate, { color: colors.secondary }]}>
                {comment.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
              </Text>
            </View>
          ))}

          {comments.length === 0 && (
            <Text style={[styles.noComments, { color: colors.secondary }]}>
              No comments yet. Be the first to comment!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.primary, borderColor: colors.border }]}
          placeholder="Write a comment..."
          placeholderTextColor={colors.secondary}
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.accent }]}
          onPress={handleSubmitComment}
          disabled={!commentText.trim() || submittingComment}
        >
          {submittingComment ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Ionicons name="send" size={20} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: 'System',
    lineHeight: 36,
  },
  meta: {
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'System',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  likeCount: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
    fontFamily: 'System',
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'System',
  },
  commentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'System',
  },
  commentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: 'System',
  },
  commentDate: {
    fontSize: 12,
    fontFamily: 'System',
  },
  noComments: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 32,
    fontFamily: 'System',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: 'System',
  },
  submitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'System',
  },
});

