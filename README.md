# Sai Baba Miracles App

A community platform where users share spiritual experiences related to Sai Baba. Built with React Native, Redux Toolkit, and Firebase.

## Features

- **Authentication**: Sign in with Google, Facebook, or Apple (iOS)
- **Feed**: Quora-style feed with infinite scroll
- **Posts**: Create, view, like, comment, and share posts
- **Dark/Light Mode**: Toggle between themes
- **Admin Controls**: Admin users can review and delete posts
- **Comments**: Full comment system on posts

## Tech Stack

- **React Native** with Expo
- **Redux Toolkit** for state management
- **Firebase** (Auth & Firestore) for backend
- **React Navigation** (Stack & Drawer)
- **styled-components** for styling

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google, Facebook, Apple)
   - Create a Firestore database
   - Copy your Firebase config to `firebase.config.js`

3. **Update Firebase Config**
   Replace the placeholder values in `firebase.config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     // ... etc
   };
   ```

4. **Run the App**
   ```bash
   npm start
   ```

## Firebase Setup

### Authentication Setup

For OAuth providers (Google, Facebook, Apple), you'll need to:

1. **Google Sign-In:**
   - Enable Google Sign-In in Firebase Console
   - Configure OAuth consent screen in Google Cloud Console
   - For React Native, use `expo-auth-session` to handle OAuth flow
   - Example implementation:
   ```javascript
   import * as AuthSession from 'expo-auth-session';
   import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
   
   const request = new AuthSession.AuthRequest({
     clientId: 'YOUR_GOOGLE_CLIENT_ID',
     scopes: ['openid', 'profile', 'email'],
     responseType: AuthSession.ResponseType.IdToken,
   });
   
   const result = await request.promptAsync({
     authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
   });
   
   if (result.type === 'success') {
     const credential = GoogleAuthProvider.credential(result.params.id_token);
     await signInWithCredential(auth, credential);
   }
   ```

2. **Facebook Sign-In:**
   - Enable Facebook Sign-In in Firebase Console
   - Configure Facebook App ID and App Secret
   - Similar OAuth flow using `expo-auth-session`

3. **Apple Sign-In:**
   - Enable Apple Sign-In in Firebase Console (iOS only)
   - Configure Apple Services ID
   - Consider using `expo-apple-authentication` package for iOS

### Firestore Collections Structure

- **users**: User profiles
  ```
  users/{userId}
    - email: string
    - displayName: string
    - photoURL: string
    - role: 'admin' | 'user'
    - createdAt: timestamp
  ```

- **posts**: User posts
  ```
  posts/{postId}
    - title: string
    - content: string
    - authorId: string
    - authorName: string
    - likeCount: number
    - commentCount: number
    - likedBy: array<string>
    - createdAt: timestamp
  ```

- **posts/{postId}/comments**: Comments on posts
  ```
  comments/{commentId}
    - text: string
    - userId: string
    - userName: string
    - createdAt: timestamp
  ```

### Setting Admin Users

To make a user an admin, update their role in Firestore:
```javascript
// In Firestore console or through code
db.collection('users').doc(userId).update({
  role: 'admin'
});
```

## Project Structure

```
├── App.js                 # Root component
├── firebase.config.js     # Firebase configuration
├── src/
│   ├── navigation/        # Navigation setup
│   ├── screens/           # Screen components
│   ├── components/        # Reusable components
│   ├── store/             # Redux store and slices
│   ├── hooks/             # Custom hooks
│   └── constants/         # Constants and colors
```

## Notes

- The app uses Expo for easier development and deployment
- Social login (Google, Facebook, Apple) requires additional configuration in Firebase Console
- For production, you'll need to configure OAuth redirects properly
- Admin functionality is controlled by the `role` field in the user document

## License

MIT

