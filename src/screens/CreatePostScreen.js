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
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useTheme } from '../hooks/useTheme';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'ne', name: 'नेपाली (Nepali)' },
  { code: 'si', name: 'සිංහල (Sinhala)' },
  { code: 'sa', name: 'संस्कृतम् (Sanskrit)' },
  { code: 'kok', name: 'कोंकणी (Konkani)' },
  { code: 'mai', name: 'मैथिली (Maithili)' },
  { code: 'mni', name: 'ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)' },
  { code: 'sd', name: 'سنڌي (Sindhi)' },
  { code: 'ks', name: 'کٲشُر (Kashmiri)' },
  { code: 'doi', name: 'डोगरी (Dogri)' },
];

export default function CreatePostScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [language, setLanguage] = useState('en');
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
          <View style={[styles.languagePickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Picker
              selectedValue={language}
              onValueChange={setLanguage}
              style={[styles.picker, { color: colors.primary }]}
              dropdownIconColor={colors.primary}
            >
              {LANGUAGES.map((lang) => (
                <Picker.Item
                  key={lang.code}
                  label={lang.name}
                  value={lang.code}
                />
              ))}
            </Picker>
          </View>
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
  languagePickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: '100%',
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

