import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import { useTheme } from '../hooks/useTheme';

// SplashScreen component - now just a UI component
// Auth state is handled in App.js AuthInitializer
export default function SplashScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image 
        source={require('../../assets/splash.png')} 
        style={styles.splashImage}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.primary }]}>Sai Baba Miracles</Text>
      <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '80%',
    height: 250,
    maxWidth: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
    fontFamily: 'System',
  },
  loader: {
    marginTop: 20,
  },
});

