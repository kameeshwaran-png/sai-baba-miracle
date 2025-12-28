import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import * as SplashScreenNative from 'expo-splash-screen';
import { auth } from '../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, setLoading } from '../store/slices/authSlice';
import { useTheme } from '../hooks/useTheme';

// Keep the native splash screen visible while we load
SplashScreenNative.preventAutoHideAsync();

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../../firebase.config');
          
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: userData?.role || 'user',
          }));
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user',
          }));
        }
      } else {
        dispatch(setUser(null));
      }
      
      // Hide native splash screen once auth state is determined
      await SplashScreenNative.hideAsync();
    });

    return () => unsubscribe();
  }, [dispatch]);

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
    height: 200,
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

