import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTheme } from '../hooks/useTheme';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
];

export default function CreatePostScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for your post.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Validation Error', 'Please enter content for your post.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Error', 'Please login to create a post.');
      return;
    }

    try {
      setLoading(true);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        language,
        authorName: isAnonymous ? 'Anonymous' : (user.displayName || user.email?.split('@')[0] || 'User'),
        authorId: isAnonymous ? null : user.uid,
        authorImage: isAnonymous ? null : (user.photoURL || null),
        createdAt: serverTimestamp(),
        likeCount: 1, // Default likes count
        commentCount: 0,
        likedBy: [],
      };

      await addDoc(collection(db, 'posts'), postData);

      Alert.alert(
        'Success',
        'Your post has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === language);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Title</Text>
          <TextInput
            style={[styles.titleInput, { backgroundColor: colors.surface, color: colors.primary, borderColor: colors.border }]}
            placeholder="Enter post title"
            placeholderTextColor={colors.secondary}
            value={title}
            onChangeText={setTitle}
            maxLength={200}
            autoFocus
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Content</Text>
          <TextInput
            style={[styles.contentInput, { backgroundColor: colors.surface, color: colors.primary, borderColor: colors.border }]}
            placeholder="Share your experience, thoughts, or story..."
            placeholderTextColor={colors.secondary}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            maxLength={5000}
          />
        </View>

        {/* Privacy Toggle */}
        <View style={[styles.toggleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.toggleContent}>
            <Ionicons name="eye-off-outline" size={20} color={colors.secondary} />
            <Text style={[styles.toggleLabel, { color: colors.primary }]}>Post Anonymously</Text>
          </View>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Language Picker */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.primary }]}>Select Language</Text>
          <TouchableOpacity
            style={[styles.languagePicker, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowLanguagePicker(!showLanguagePicker)}
          >
            <Text style={[styles.languageText, { color: colors.primary }]}>
              {selectedLanguage ? selectedLanguage.name : 'Select Language'}
            </Text>
            <Ionicons
              name={showLanguagePicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.secondary}
            />
          </TouchableOpacity>

          {showLanguagePicker && (
            <View style={[styles.languageOptions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && { backgroundColor: colors.accent + '20' },
                  ]}
                  onPress={() => {
                    setLanguage(lang.code);
                    setShowLanguagePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      { color: language === lang.code ? colors.accent : colors.primary },
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {language === lang.code && (
                    <Ionicons name="checkmark" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.accent }]}
          onPress={handleSubmit}
          disabled={loading || !title.trim() || !content.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Publish Post</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
    lineHeight: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  languagePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  languageText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  languageOptions: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageOptionText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
});

