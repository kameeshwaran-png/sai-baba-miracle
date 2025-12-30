import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  signInWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { auth, db } from '../../firebase.config';
import { setUser } from '../store/slices/authSlice';
import { useTheme } from '../hooks/useTheme';

// Complete web browser session for OAuth
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs
const GOOGLE_CLIENT_ID = '646552958318-4575892dr8trf7i56tdq7do6fggt3637.apps.googleusercontent.com';
const IOS_CLIENT_ID = '646552958318-aukbcpnkl451p7vfcfc8g4p85e5f2l3j.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '646552958318-5bp7ur8ptjom7vc3mdoq5mc396t20g73.apps.googleusercontent.com';

export default function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);

  // Setup Google OAuth request using Google provider hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    // MUST ADD THESE TWO LINES:
    useProxy: false,
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'com.saibabamiracles.app',
      preferLocalhost: false,
    }),
  });

  // Helper function to handle authentication response
  const handleAuthResponse = async (authResponse) => {
    try {
     // For native Android, the token is often in authentication.idToken
      // whereas in proxy mode it's in params.id_token
      const idToken = authResponse.authentication?.idToken || authResponse.params?.id_token;

      if (!idToken) {
        console.error('Full Auth Response:', authResponse); // Log to see what was returned
        throw new Error('No ID token received from Google');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      console.log('Firebase sign-in successful, user:', user.email);

      // Handle user data (create/update user document)
      await handleUserData(user);
    } catch (error) {
      console.error('Error processing auth response:', error);
      Alert.alert(
        'Login Error',
        error.message || 'Failed to sign in with Google. Please try again.'
      );
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleAuthResponse(response);
    } else if (response?.type === 'error') {
      console.error('OAuth error:', response.error);
      setLoading(false);
      setLoadingProvider(null);
      Alert.alert(
        'Login Error',
        response.error?.message || 'Authentication failed. Please try again.'
      );
    } else if (response?.type === 'cancel') {
      console.log('User cancelled Google sign-in');
      setLoading(false);
      setLoadingProvider(null);
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    try {
      if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
        Alert.alert(
          'Configuration Required',
          'Please set your Google OAuth Client ID in SignUpScreen.js. See GOOGLE_OAUTH_SETUP.md for instructions.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (!request || !promptAsync) {
        Alert.alert(
          'Initialization Error',
          'OAuth request is not ready. Please try again.'
        );
        return;
      }

      setLoading(true);
      setLoadingProvider('google');

      console.log('Starting OAuth flow...');
      await promptAsync();
      // The response will be handled in the useEffect hook above
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert(
        'Login Error',
        error.message || 'Failed to start Google sign-in. Please try again.'
      );
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      setLoadingProvider('facebook');

      // Similar to Google - needs proper OAuth implementation
      Alert.alert(
        'OAuth Setup Required',
        'Please configure Facebook OAuth in Firebase Console and implement the full OAuth flow using expo-auth-session. See README for details.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Login Error', error.message || 'Failed to sign in with Facebook.');
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
      // or implement OAuth flow similar to Google/Facebook
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo Placeholder */}
      <View style={styles.logoContainer}>
        <Ionicons name="rose" size={80} color={colors.accent} />
        <Text style={[styles.appTitle, { color: colors.primary }]}>Sai Baba Miracles</Text>
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

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleFacebookLogin}
          disabled={loading}
        >
          {loadingProvider === 'facebook' ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              <Text style={[styles.socialButtonText, { color: colors.primary }]}>
                Continue with Facebook
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
        Note: OAuth authentication requires additional setup. Please configure Firebase OAuth providers.
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
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 20,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
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
