import 'react-native-gesture-handler';
import 'react-native-reanimated';
// CRITICAL: Import reanimatedSetup BEFORE any navigation code
// This ensures the patch is applied before @react-navigation/drawer loads
import './src/utils/reanimatedSetup';
// Initialize i18n
import './src/i18n/config';
import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthInitializer from './src/components/AuthInitializer';
import { GOOGLE_WEB_CLIENT_ID } from './src/config/googleSignin.config';

// Configure Google Sign-In at app level
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // Required for getting idToken on iOS and Android
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: Platform.OS === 'ios' ? '646552958318-aukbcpnkl451p7vfcfc8g4p85e5f2l3j.apps.googleusercontent.com' : undefined,
});

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AuthInitializer>
            <AppNavigator />
          </AuthInitializer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

