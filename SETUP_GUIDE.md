# Sai Baba Miracles App - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication → Sign-in method → Enable Google, Facebook, and Apple (iOS)
   - Create a Firestore database (Start in test mode for development)
   - Copy your Firebase config values to `firebase.config.js`

3. **Update Firebase Config**
   Edit `firebase.config.js` and replace:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Run the App**
   ```bash
   npm start
   ```
   Then press `i` for iOS simulator or `a` for Android emulator

## Important Notes

### OAuth Authentication Setup Required

The current implementation has placeholder functions for OAuth (Google, Facebook, Apple). For production, you need to:

1. **For Google Sign-In:**
   - Set up OAuth 2.0 credentials in Google Cloud Console
   - Implement proper OAuth flow using `expo-auth-session`
   - See the example code structure in `SignUpScreen.js`

2. **For Facebook Sign-In:**
   - Create a Facebook App
   - Configure Facebook App ID and Secret in Firebase
   - Implement OAuth flow similar to Google

3. **For Apple Sign-In (iOS only):**
   - Configure Apple Sign In in Apple Developer Console
   - Consider using `expo-apple-authentication` package

### Firestore Security Rules

Set up proper security rules for your Firestore database. Example rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.authorId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Comments subcollection
    match /posts/{postId}/comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Setting Admin Users

To make a user an admin, update their document in Firestore:

1. Go to Firestore Console
2. Navigate to `users/{userId}`
3. Add/update field: `role: "admin"`

Or use Firebase Admin SDK in your backend:

```javascript
await db.collection('users').doc(userId).update({ role: 'admin' });
```

### Assets

Place app icons and splash screens in the `assets/` directory:
- `icon.png` (1024x1024px)
- `splash.png` (1242x2436px)
- `adaptive-icon.png` (1024x1024px for Android)
- `favicon.png` (48x48px for web)

The app will work without these, but they're recommended for production.

## Features Implemented

✅ Splash screen with auth state checking
✅ Sign up screen with social login buttons (UI ready, OAuth needs implementation)
✅ Dashboard with Quora-style feed
✅ Infinite scroll pagination
✅ Post cards with like, comment, share functionality
✅ Details screen with full post and comments
✅ Settings screen with theme toggle (Light/Dark mode)
✅ Drawer navigation
✅ Admin controls (delete posts)
✅ Feedback button (opens email client)

## Next Steps

1. Implement full OAuth flows for Google, Facebook, and Apple
2. Create a "Create Post" screen (currently shows an alert)
3. Add image upload functionality for posts
4. Implement push notifications
5. Add user profile screens
6. Add search functionality
7. Add filters and categories for posts

## Troubleshooting

### Firebase Auth not working
- Make sure you've enabled the authentication methods in Firebase Console
- Check that your Firebase config is correct
- For OAuth, ensure you've set up proper redirect URIs

### Theme not switching
- Make sure Redux store is properly connected
- Check that theme slice is working correctly
- Verify components are using `useTheme` hook

### Navigation issues
- Ensure all screen components are properly exported
- Check that navigation structure matches screen names

