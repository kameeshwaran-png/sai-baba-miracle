import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Image,
  Platform,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { logout } from '../store/slices/authSlice';
import { toggleTheme, setLanguage } from '../store/slices/themeSlice';
import { useTheme } from '../hooks/useTheme';
import { useAdmin } from '../hooks/useAdmin';

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

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors, mode } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const { isAdmin } = useAdmin();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Sync language on mount
  React.useEffect(() => {
    setSelectedLanguage(i18n.language || 'en');
  }, [i18n.language]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);
    await i18n.changeLanguage(langCode);
    // Update Redux store as well
    dispatch(setLanguage(langCode));
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirm'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              dispatch(logout());
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert(t('common.error'), t('settings.logout') + ' ' + t('common.error'));
            }
          },
        },
      ]
    );
  };

  const handleOpenFeedback = () => {
    setShowFeedbackModal(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
    setFeedbackText('');
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert(t('common.error'), t('feedback.placeholder'));
      return;
    }

    if (!user?.uid) {
      Alert.alert(t('common.error'), t('feedback.loginRequired'));
      return;
    }

    try {
      setSubmittingFeedback(true);
      await addDoc(collection(db, 'feedback'), {
        text: feedbackText.trim(),
        userId: user.uid,
        userEmail: user.email || 'anonymous',
        userName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
      });

      Alert.alert(t('common.success'), t('feedback.success'));
      handleCloseFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert(t('common.error'), t('feedback.error'));
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === selectedLanguage) || LANGUAGES[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: User Profile */}
        <View style={[styles.profileSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.profileContent}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="person" size={32} color={colors.accent} />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.primary }]}>
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.secondary }]}>
                {user?.email || 'No email'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Settings Options */}
        <View style={styles.section}>
          {/* Appearance Toggle */}
          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleToggleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name={mode === 'dark' ? 'moon' : 'sunny'}
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.settingLabel, { color: colors.primary }]}>
                {t('settings.appearance')}
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: colors.secondary }]}>
                {mode === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
              </Text>
              <Switch
                value={mode === 'dark'}
                onValueChange={handleToggleTheme}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#ffffff"
                ios_backgroundColor={colors.border}
              />
            </View>
          </TouchableOpacity>

          {/* Language Picker */}
          <View style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.primary }]}>
                {t('settings.preferredLanguage')}
              </Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={handleLanguageChange}
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

          {/* Feedback Option */}
          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleOpenFeedback}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubble-outline" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.primary }]}>
                {t('settings.contactFeedback')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>

          {/* Feedbacks List (Admin Only) */}
          {isAdmin && (
            <TouchableOpacity
              style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Feedback')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="list-outline" size={22} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.primary }]}>
                  Feedbacks List
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
            </TouchableOpacity>
          )}

          {/* About this App Option */}
          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('About')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.primary }]}>
                {t('settings.aboutApp')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={[styles.logoutText, { color: colors.error }]}>{t('settings.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseFeedback}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseFeedback}
          />
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>
                {t('feedback.title')}
              </Text>
              <TouchableOpacity onPress={handleCloseFeedback}>
                <Ionicons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.feedbackInput,
                {
                  color: colors.primary,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              placeholder={t('feedback.placeholder')}
              placeholderTextColor={colors.secondary}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={1000}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: colors.accent,
                  opacity: submittingFeedback || !feedbackText.trim() ? 0.5 : 1,
                },
              ]}
              onPress={handleSubmitFeedback}
              disabled={submittingFeedback || !feedbackText.trim()}
            >
              {submittingFeedback ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>{t('feedback.submit')}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 40,
    marginTop: 50,
  },
  profileSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  profileEmail: {
    fontSize: 15,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  section: {
    marginBottom: 32,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingLabel: {
    fontSize: 17,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 17,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  pickerContainer: {
    flex: 1,
    maxWidth: 200,
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: '100%',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  feedbackInput: {
    minHeight: 150,
    maxHeight: 200,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
});
