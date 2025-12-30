# Development Build Setup for Google OAuth

## Changes Applied

✅ **expo-dev-client** installed
✅ Code updated to use custom app scheme (`com.saibabamiracles.app://`)
✅ Proxy disabled (`useProxy: false`)
✅ `expo-dev-client` added to app.json plugins

## Next Steps

### 1. Build and Run Development Build

**For Android:**
```bash
npx expo run:android
```

**For iOS:**
```bash
npx expo run:ios
```

This will:
- Prebuild native code
- Build the app with development client
- Install it on your device/emulator

### 2. Update Google Cloud Console

Since we're now using a Development Build with a custom scheme, you need to:

#### For Android:
1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials?project=saibaba-community)
2. Find your **Android Client ID**: `646552958318-tfp6gjuvfvo54b8rrf5bk4hvrrluaq3v.apps.googleusercontent.com`
3. Verify these settings:
   - **Package name**: `com.saibabamiracles.app`
   - **SHA-1 certificate fingerprint**: Get this from your build credentials

#### For iOS:
1. Find your **iOS Client ID**: `646552958318-aukbcpnkl451p7vfcfc8g4p85e5f2l3j.apps.googleusercontent.com`
2. Verify:
   - **Bundle ID**: `com.saibabamiracles.app`

#### For Web Client (if still needed):
1. Find your **Web Client ID**: `646552958318-4575892dr8trf7i56tdq7do6fggt3637.apps.googleusercontent.com`
2. Under **Authorized redirect URIs**, add:
   ```
   com.saibabamiracles.app://
   ```

### 3. Get SHA-1 Fingerprint (Android)

To get your SHA-1 fingerprint for Android:

```bash
# For debug keystore (development)
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Or get from EAS credentials
npx eas credentials
```

Copy the SHA-1 fingerprint and add it to your Android OAuth client in Google Cloud Console.

## Important Notes

1. **No More Expo Go**: You can no longer use the standard Expo Go app. You must use the Development Build.

2. **Custom Scheme**: The app now uses `com.saibabamiracles.app://` as the redirect URI, which is more secure and Google-compliant.

3. **Development vs Production**: 
   - Development Build: Uses debug keystore (for testing)
   - Production Build: Uses release keystore (for app store)

4. **Testing**: After building, test Google sign-in. It should work without the `exp://` URI errors.

## Troubleshooting

If you still get redirect URI errors:
1. Verify the redirect URI in console logs matches `com.saibabamiracles.app://`
2. Make sure it's added to Google Cloud Console (Web client)
3. For Android, verify SHA-1 fingerprint matches
4. Wait 1-2 minutes after making Google Console changes

## Running the App

After building, you can start the development server:
```bash
npx expo start --dev-client
```

This will start Metro bundler for your Development Build.

