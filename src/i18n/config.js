import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import as from './locales/as.json';
import ur from './locales/ur.json';
import ne from './locales/ne.json';
import si from './locales/si.json';
import sa from './locales/sa.json';
import kok from './locales/kok.json';
import mai from './locales/mai.json';
import mni from './locales/mni.json';
import sd from './locales/sd.json';
import ks from './locales/ks.json';
import doi from './locales/doi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  ta: { translation: ta },
  te: { translation: te },
  mr: { translation: mr },
  gu: { translation: gu },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ur: { translation: ur },
  ne: { translation: ne },
  si: { translation: si },
  sa: { translation: sa },
  kok: { translation: kok },
  mai: { translation: mai },
  mni: { translation: mni },
  sd: { translation: sd },
  ks: { translation: ks },
  doi: { translation: doi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Load saved language
AsyncStorage.getItem('user-language').then((savedLanguage) => {
  if (savedLanguage && i18n.hasResourceBundle(savedLanguage, 'translation')) {
    i18n.changeLanguage(savedLanguage);
  }
});

// Save language when changed
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem('user-language', lng).catch((error) => {
    console.error('Error saving language:', error);
  });
});

export default i18n;

