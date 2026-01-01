import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Info } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

export default function AboutScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            {t('about.title')}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Sai Baba Image */}
          <View style={[styles.imageContainer, { backgroundColor: mode === 'dark' ? 'black' : colors.surface, borderColor: colors.border }]}>
            <Image
              source={mode === 'dark' ? require('../../assets/logo_black.png') : require('../../assets/logo_white.png')}
              style={styles.saiBabaImage}
              resizeMode="contain"
            />
          </View>

          {/* App Info */}
          <View style={[styles.appInfoContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.appInfoHeader}>
              <Info size={28} color={colors.accent} strokeWidth={2} />
              <Text style={[styles.appName, { color: colors.primary }]}>
                {t('about.appName')}
              </Text>
            </View>
            <Text style={[styles.version, { color: colors.secondary }]}>
              {t('about.version')} 1.0.0
            </Text>
            <Text style={[styles.tagline, { color: colors.primary }]}>
              {t('about.tagline')}
            </Text>
          </View>

          {/* Content Sections */}
          <View style={styles.contentSection}>
            {/* Mission */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                {t('about.mission.title')}
              </Text>
              <Text style={[styles.sectionText, { color: colors.primary }]}>
                {t('about.mission.content')}
              </Text>
            </View>

            {/* Credits */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                {t('about.credits.title')}
              </Text>
              <Text style={[styles.sectionText, { color: colors.primary }]}>
                {t('about.credits.content')}
              </Text>
            </View>

            {/* No-Ads Policy */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                {t('about.noAds.title')}
              </Text>
              <Text style={[styles.sectionText, { color: colors.primary }]}>
                {t('about.noAds.content')}
              </Text>
            </View>

            {/* Disclaimer */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                {t('about.disclaimer.title')}
              </Text>
              <Text style={[styles.sectionText, { color: colors.primary }]}>
                {t('about.disclaimer.content')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  headerTitle: {
    fontSize: 20,
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
    paddingBottom: 20,
  },
  imageContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  saiBabaImage: {
    width: '100%',
    height: 200,
  },
  appInfoContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  version: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  contentSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 16,
  },
  sectionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
});

