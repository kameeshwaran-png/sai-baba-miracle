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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { logout } from '../store/slices/authSlice';
import { toggleTheme, setLanguage } from '../store/slices/themeSlice';
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

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors, mode } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const language = useSelector((state) => state.theme.language);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageChange = (langCode) => {
    dispatch(setLanguage(langCode));
    setShowLanguagePicker(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              dispatch(logout());
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Settings</Text>
      </View>

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

        {/* Section 2: Configuration */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondary }]}>CONFIGURATION</Text>
          
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
              <Text style={[styles.settingLabel, { color: colors.primary }]}>Appearance</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: colors.secondary }]}>
                {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
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
              <Text style={[styles.settingLabel, { color: colors.primary }]}>Preferred Language</Text>
            </View>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowLanguagePicker(!showLanguagePicker)}
            >
              <Text style={[styles.settingValue, { color: colors.accent }]}>
                {selectedLanguage.name}
              </Text>
              <Ionicons
                name={showLanguagePicker ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>

          {showLanguagePicker && (
            <View style={[styles.languagePickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && { backgroundColor: colors.accent + '15' },
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
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

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
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
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languagePickerContainer: {
    marginHorizontal: 20,
    marginTop: StyleSheet.hairlineWidth,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  languageOptionText: {
    fontSize: 17,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
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
});
