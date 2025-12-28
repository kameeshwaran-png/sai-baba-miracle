import React, { useCallback } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the native splash screen visible while we load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const onLayoutRootView = useCallback(async () => {
    // This will be called when the app is ready
    // The SplashScreen component will handle hiding it after auth check
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

