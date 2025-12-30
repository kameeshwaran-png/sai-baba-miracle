import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { doc, updateDoc, increment, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const PREVIEW_HEIGHT = Dimensions.get('window').height * 0.3;

export default function FeedCard({ post, onPress, navigation }) {
  const { colors } = useTheme();
  const userRole = useSelector((state) => state.auth.userRole);
  const userId = useSelector((state) => state.auth.user?.uid);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  useEffect(() => {
    if (post.likedBy && userId) {
      setLiked(post.likedBy.includes(userId));
    }
    setLikeCount(post.likeCount || 0);
    setCommentCount(post.commentCount || 0);
  }, [post, userId]);

  const handleLike = async () => {
    if (!userId) {
      Alert.alert('Login Required', 'Please login to like posts');
      return;
    }

    try {
      const postRef = doc(db, 'posts', post.id);
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
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  const handleComment = () => {
    if (onPress) {
      onPress();
    } else if (navigation) {
      navigation.navigate('Details', { postId: post.id });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.content.substring(0, 100)}...`,
        title: post.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = () => {
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
              await deleteDoc(doc(db, 'posts', post.id));
              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          },
        },
      ]
    );
  };

  const shouldShowReadMore = post.content.length > 200;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={handleComment}
      activeOpacity={0.7}
    >
      {/* Admin Actions */}
      {userRole === 'admin' && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {post.authorImage ? (
            <Image
              source={{ uri: post.authorImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="person" size={20} color={colors.accent} />
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.authorName, { color: colors.primary }]}>
            {post.authorName || 'Anonymous'}
          </Text>
          <Text style={[styles.postDate, { color: colors.secondary }]}>
            {post.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text
        style={[styles.title, { color: colors.primary }]}
        numberOfLines={2}
      >
        {post.title}
      </Text>

      {/* Content Preview */}
      <View style={[styles.contentContainer, { maxHeight: PREVIEW_HEIGHT }]}>
        <Text style={[styles.content, { color: colors.secondary }]}>
          {post.content}
        </Text>
        {shouldShowReadMore && (
          <Text style={[styles.readMore, { color: colors.accent }]}>
            Read more...
          </Text>
        )}
      </View>

      {/* Footer Actions */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? colors.error : colors.secondary}
          />
          <Text style={[styles.actionText, { color: colors.secondary }]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleComment}
        >
          <Ionicons name="chatbubble-outline" size={22} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.secondary }]}>
            {commentCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={22} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.secondary }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: 8,
    padding: 20,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  postDate: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
    lineHeight: 30,
  },
  contentContainer: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  readMore: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
});

