import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as SplashScreenNative from 'expo-splash-screen';
import { auth } from '../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, setLoading } from '../store/slices/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

// Keep the native splash screen visible while we load
SplashScreenNative.preventAutoHideAsync();

/**
 * AuthInitializer Component
 * 
 * This component initializes Firebase authentication state listener
 * and updates Redux store with user information.
 * 
 * The splash screen is kept visible until auth state is determined
 * to prevent flickering between auth and authenticated screens.
 */
export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    // Initialize auth state listener
    // This listener is automatically called by Firebase:
    // - When the app starts (checks persisted session)
    // - When auth state changes (sign in, sign out, token refresh)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      try {
        if (user) {
          // User is signed in - fetch additional user data from Firestore
          try {
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
            // Still set user even if Firestore fetch fails
            dispatch(setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: 'user',
            }));
          }
        } else {
          // No user signed in
          dispatch(setUser(null));
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        dispatch(setUser(null));
      } finally {
        // Ensure loading is set to false
        dispatch(setLoading(false));
        
        // Hide splash screen after auth state is determined
        if (isMounted) {
          // Small delay to ensure smooth transition
          setTimeout(async () => {
            try {
              await SplashScreenNative.hideAsync();
            } catch (error) {
              // Ignore errors when hiding splash screen
              // It may already be hidden
            }
          }, 100);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [dispatch]);

  return children;
}

