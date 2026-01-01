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
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthInitializer from './src/components/AuthInitializer';

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

