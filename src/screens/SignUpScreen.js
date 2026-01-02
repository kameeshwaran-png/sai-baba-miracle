import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, db } from '../../firebase.config';
import { setUser } from '../store/slices/authSlice';
import { useTheme } from '../hooks/useTheme';
import { GOOGLE_WEB_CLIENT_ID } from '../config/googleSignin.config';

export default function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors, mode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setLoadingProvider('google');

      // Check if your device supports Google Play (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      // Get user info from Google Sign-In
      await GoogleSignin.signIn();

      // Get the ID token after sign-in
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      console.log('Firebase sign-in successful, user:', user.email);

      // Handle user data (create/update user document)
      await handleUserData(user);
    } catch (error) {
      console.error('Google login error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));

      // Handle specific error cases
      if (error.code === 'sign_in_cancelled' || error.code === '10') {
        // User cancelled the login flow
        console.log('User cancelled Google sign-in');
        // Don't show error for user cancellation
        return;
      } else if (error.code === 'in_progress' || error.code === '7') {
        // Sign in is already in progress
        console.log('Sign in already in progress');
        Alert.alert('Sign In', 'Sign in is already in progress. Please wait.');
      } else if (error.code === 'play_services_not_available' || error.code === '2') {
        Alert.alert(
          'Error',
          'Google Play Services is not available. Please update Google Play Services from the Play Store.'
        );
      } else if (error.code === '12500' || error.message?.includes('non-recoverable sign in failure')) {
        // Common error: SHA-1 fingerprint not configured
        Alert.alert(
          'Configuration Error',
          'Google Sign-In is not properly configured. Please ensure:\n\n' +
          '1. SHA-1 fingerprint is added to Firebase Console\n' +
          '2. google-services.json is up to date\n' +
          '3. Package name matches in Firebase Console\n\n' +
          'Check GOOGLE_SIGNIN_SETUP.md for details.'
        );
      } else {
        Alert.alert(
          'Login Error',
          error.message || `Failed to sign in with Google. Error code: ${error.code || 'unknown'}`
        );
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not Available', 'Apple Sign In is only available on iOS.');
      return;
    }

    try {
      setLoading(true);
      setLoadingProvider('apple');

      // For Apple Sign In on iOS, you can use expo-apple-authentication
      // or implement OAuth flow similar to Google
      Alert.alert(
        'OAuth Setup Required',
        'Please configure Apple OAuth in Firebase Console. For iOS, consider using expo-apple-authentication package.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Apple login error:', error);
      Alert.alert('Login Error', error.message || 'Failed to sign in with Apple.');
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // Helper function to handle user data after successful authentication
  const handleUserData = async (user) => {
    try {
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL || null,
          role: 'user', // Default role
          createdAt: new Date().toISOString(),
        });
      }

      const userData = userDoc.exists() ? userDoc.data() : {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
      };

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL,
        role: userData.role || 'user',
      }));
    } catch (error) {
      console.error('Error handling user data:', error);
      throw error;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={[styles.imageContainer, { backgroundColor: mode === 'dark' ? 'black' : colors.surface, borderColor: colors.border }]}>
          <Image
            source={mode === 'dark' ? require('../../assets/logo_black.png') : require('../../assets/logo_white.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Share your spiritual experiences
        </Text>
      </View>

      {/* Social Login Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loadingProvider === 'google' ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text style={[styles.socialButtonText, { color: colors.primary }]}>
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleAppleLogin}
            disabled={loading}
          >
            {loadingProvider === 'apple' ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Ionicons name="logo-apple" size={24} color={colors.primary} />
                <Text style={[styles.socialButtonText, { color: colors.primary }]}>
                  Continue with Apple
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.note, { color: colors.secondary }]}>
        This platform is for Sai Baba Devotees who want to share their spiritual experiences with the world.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  imageContainer: {
    width: '60%',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 20,
  },
  logoImage: {
    width: '100%',
    height: 150,
  },
  appTitleContainer: {
    marginTop: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 20,
    fontFamily: 'System',
  },
  appTitleFirstChar: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
    textShadowColor: 'rgba(13, 99, 50, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    transform: [{ scaleY: 1.1 }],
  },
  appTitleRest: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.85,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    fontFamily: 'System',
  },
});
