import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { useTheme } from '../hooks/useTheme';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors, mode } = useTheme();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleFeedback = () => {
    const email = 'support@example.com';
    const subject = 'Sai Baba Miracles App Feedback';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open email client');
        }
      })
      .catch((error) => {
        console.error('Error opening email:', error);
        Alert.alert('Error', 'Failed to open email client');
      });
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Settings</Text>
        <View style={styles.menuButton} />
      </View>

      {/* Settings Content */}
      <View style={styles.content}>
        {/* Theme Toggle */}
        <View style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons
              name={mode === 'dark' ? 'moon' : 'sunny'}
              size={24}
              color={colors.primary}
            />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.primary }]}>Theme</Text>
              <Text style={[styles.settingDescription, { color: colors.secondary }]}>
                {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={handleToggleTheme}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#ffffff"
            ios_backgroundColor={colors.border}
          />
        </View>

        {/* Feedback */}
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleFeedback}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: colors.primary }]}>Feedback</Text>
              <Text style={[styles.settingDescription, { color: colors.secondary }]}>
                Send us your feedback
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondary }]}>About</Text>
          
          <View style={[styles.settingItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.primary }]}>Version</Text>
                <Text style={[styles.settingDescription, { color: colors.secondary }]}>
                  1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ffffff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    fontFamily: 'System',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'System',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    gap: 12,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

