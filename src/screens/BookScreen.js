import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Pdf from 'react-native-pdf';
import { useTheme } from '../hooks/useTheme';

const LANGUAGES = [
  { name: 'English', code: 'en', fileName: 'English.pdf' },
];

export default function BookScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setPdfLoading(true);
    setPdfError(false);
  };

  const handleClosePdf = () => {
    setSelectedLanguage(null);
    setPdfLoading(false);
    setPdfError(false);
  };

  // Map file names to require statements for local assets
  // Note: All PDF files must exist in assets/pdf/ directory at build time
  const pdfSources = {
    'English.pdf': require('../../assets/pdf/English.pdf'),
  };

  const getPdfSource = (fileName) => {
    return pdfSources[fileName] || null;
  };

  if (selectedLanguage) {
    const pdfSource = getPdfSource(selectedLanguage.fileName);
    
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleClosePdf}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              {selectedLanguage.name}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* PDF Viewer */}
          {pdfLoading && !pdfError && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.secondary }]}>
                {t('book.loadingPdf')}
              </Text>
            </View>
          )}

          {pdfError && (
            <View style={styles.errorContainer}>
              <Ionicons name="document-outline" size={64} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {t('book.loadError')}
              </Text>
              <Text style={[styles.errorSubtext, { color: colors.secondary }]}>
                {t('book.loadErrorSubtext')}
              </Text>
            </View>
          )}

          {pdfSource && !pdfError && (
            <Pdf
              source={pdfSource}
              trustAllCerts={false}
              onLoadComplete={(numberOfPages) => {
                setPdfLoading(false);
                setPdfError(false);
              }}
              onPageChanged={(page, numberOfPages) => {
                // Optional: Track page changes
              }}
              onError={(error) => {
                console.error('PDF Error:', error);
                setPdfLoading(false);
                setPdfError(true);
              }}
              style={styles.pdf}
              enablePaging={false}
              horizontal={false}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
              spacing={0}
              fitPolicy={0}
              singlePage={false}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            {t('book.title')}
          </Text>
        </View>

        {/* Language List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {LANGUAGES.map((language, index) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageRow,
                {
                  backgroundColor: colors.surface,
                  borderBottomColor: colors.border,
                },
                index === 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
              ]}
              onPress={() => handleLanguageSelect(language)}
              activeOpacity={0.7}
            >
              <Text style={[styles.languageText, { color: colors.primary }]}>
                {language.name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
            </TouchableOpacity>
          ))}
          
          {/* Disclaimer Footer */}
          <View style={styles.disclaimerFooter}>
            <Text style={styles.disclaimerText}>
              {t('book.disclaimer')}
            </Text>
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
    paddingTop: 8,
    paddingBottom: 20,
    marginTop: 50,
  },
  disclaimerFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eeeeee',
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  languageText: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E4E4E4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
  },
});

