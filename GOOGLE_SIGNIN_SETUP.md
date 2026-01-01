# Google Sign-In Setup with @react-native-google-signin/google-signin

This guide explains how to set up Google Sign-In using `@react-native-google-signin/google-signin` package.

## Installation

1. Install the package:
```bash
npm install @react-native-google-signin/google-signin
# or
yarn add @react-native-google-signin/google-signin
```

2. For Expo projects, you need to use Expo Development Build (not Expo Go):
```bash
npx expo install expo-dev-client
npx expo prebuild
```

3. Install iOS pods (iOS only):
```bash
cd ios && pod install && cd ..
```

## Configuration

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Create OAuth 2.0 Client IDs:
   - **Web Client ID**: Used in the app configuration (this is your main client ID)
   - **iOS Client ID**: For iOS apps (bundle ID: `com.saibabamiracles.app`)
   - **Android Client ID**: Usually auto-detected from `google-services.json`

### 2. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Google** sign-in provider
5. Add your OAuth client IDs

### 3. Android Configuration

1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/` directory
3. The Android Client ID will be automatically detected from this file

### 4. iOS Configuration

1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to your Xcode project (drag and drop into the project)
3. Ensure it's added to the target

4. Add URL Scheme in Xcode:
   - Open `ios/SaiBabaMiracles.xcworkspace` in Xcode
   - Select your project target
   - Go to **Info** tab
   - Under **URL Types**, add a new URL Type:
     - **Identifier**: `GoogleSignIn`
     - **URL Schemes**: Your reversed client ID from `GoogleService-Info.plist` (format: `com.googleusercontent.apps.XXXXX`)

### 5. Code Configuration

The configuration is already set up in:
- `App.js` - Global Google Sign-In configuration
- `src/config/googleSignin.config.js` - Client IDs configuration
- `src/screens/SignUpScreen.js` - Sign-in implementation

## Usage

The Google Sign-In flow is implemented in `SignUpScreen.js`. When a user taps "Continue with Google":

1. The app checks if Google Play Services is available (Android)
2. Shows Google Sign-In UI
3. User selects their Google account
4. Receives an ID token from Google
5. Signs in to Firebase using the ID token
6. Creates/updates user document in Firestore

## Troubleshooting

### Android Issues

1. **"DEVELOPER_ERROR"**: 
   - Ensure `google-services.json` is in the correct location
   - Rebuild the app after adding `google-services.json`

2. **"Sign in failed"**:
   - Check SHA-1 fingerprint is added to Firebase Console
   - Get SHA-1: `cd android && ./gradlew signingReport`

3. **"PLAY_SERVICES_NOT_AVAILABLE"**:
   - Update Google Play Services on the device
   - Or install from Play Store

### iOS Issues

1. **"Sign in failed"**:
   - Verify `GoogleService-Info.plist` is added to the target
   - Check URL Scheme is configured correctly
   - Ensure bundle ID matches in Firebase Console

2. **"No ID token"**:
   - Verify web client ID is correct
   - Check iOS client ID is configured

### General Issues

1. **"Configuration error"**:
   - Verify client IDs in `src/config/googleSignin.config.js`
   - Ensure web client ID is from Google Cloud Console

2. **Build errors**:
   - Run `npx expo prebuild` after installing the package
   - Clear cache: `npx expo start --clear`
   - Rebuild: `npx expo run:android` or `npx expo run:ios`

## Testing

1. **Development Build**:
   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

2. **Test on Device**:
   - Use a physical device for best results
   - Ensure Google Play Services is up to date (Android)
   - Ensure device is signed in to a Google account

## Migration from expo-auth-session

This implementation replaces `expo-auth-session` with `@react-native-google-signin/google-signin` for better native integration and performance.

### Changes Made:
- ✅ Removed `expo-auth-session` dependencies
- ✅ Removed `expo-web-browser` dependency
- ✅ Added `@react-native-google-signin/google-signin`
- ✅ Updated `SignUpScreen.js` implementation
- ✅ Added global configuration in `App.js`
- ✅ Created configuration file for client IDs

## Resources

- [@react-native-google-signin/google-signin Documentation](https://github.com/react-native-google-signin/google-signin)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

