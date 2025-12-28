# Google OAuth Setup - Step by Step Guide

## Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **saibaba-community**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable** to ON
6. Enter your **Project support email**
7. Click **Save**

## Step 2: Get OAuth 2.0 Client ID from Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project: **saibaba-community**
3. Navigate to **APIs & Services** → **Credentials**
4. Find or create an **OAuth 2.0 Client ID**:
   - If it doesn't exist, click **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: **Sai Baba Miracles App**

## Step 3: Configure Authorized Redirect URIs

In the OAuth 2.0 Client ID settings, add these **Authorized redirect URIs**:

### For Development (Expo Go):
```
exp://localhost:8081
exp://127.0.0.1:8081
```

### For Firebase Auth Handler:
```
https://saibaba-community.firebaseapp.com/__/auth/handler
```

### For Production (if using EAS Build):
```
com.saibabamiracles.app://
```

### For Expo Auth Session (if using):
```
https://auth.expo.io/@YOUR_EXPO_USERNAME/sai-baba-miracles
```
*(Replace YOUR_EXPO_USERNAME with your actual Expo username - find it with `npx expo whoami`)*

## Step 4: Get Your OAuth Client ID

1. In Google Cloud Console → Credentials
2. Click on your OAuth 2.0 Client ID
3. Copy the **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
4. Save this - you'll need it for the app configuration

## Step 5: Configure the App

The app code has been updated to use Google OAuth. You may need to:

1. Set the redirect URI in your app (handled automatically by expo-auth-session)
2. The implementation uses Firebase's web client ID automatically

## Step 6: Test the Implementation

1. Run your app: `npm start`
2. Open in Expo Go
3. Tap "Continue with Google"
4. You should see Google's sign-in screen
5. After signing in, you'll be redirected back to the app

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure all redirect URIs are added in Google Cloud Console
- For Expo Go, use: `exp://localhost:8081` or `exp://127.0.0.1:8081`

### Error: "invalid_client"
- Verify your OAuth Client ID is correct
- Make sure Google Sign-In is enabled in Firebase Console

### Error: "access_denied"
- Check that the OAuth consent screen is configured
- Verify your app is in testing mode or published

## Notes

- For **Expo Go**: The redirect URI is automatically handled
- For **Production builds**: You may need to configure a custom URL scheme
- The implementation uses `expo-auth-session` which handles the OAuth flow automatically

