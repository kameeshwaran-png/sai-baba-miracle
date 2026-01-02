# How to Get SHA-1 Fingerprint for Android Google Sign-In

The error "A non-recoverable sign in failure occurred" usually means the SHA-1 fingerprint is missing or incorrect in Firebase Console.

## Quick Fix Steps

### 1. Get Your SHA-1 Fingerprint

**For Debug Build:**
```bash
cd android
./gradlew signingReport
```

Look for the output under "Variant: debug" section. You'll see something like:
```
SHA1: A1:B2:C3:D4:E5:F6:...
```

**Or use keytool directly:**
```bash
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**For Release Build:**
Use your release keystore instead:
```bash
keytool -list -v -keystore /path/to/your/release.keystore -alias your-alias
```

### 2. Add SHA-1 to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **saibaba-community**
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select **Project Settings**
5. Scroll down to **Your apps** section
6. Find your Android app (`com.saibabamiracles.app`)
7. Click **Add fingerprint**
8. Paste your SHA-1 fingerprint (without colons or spaces, or with colons - both work)
9. Click **Save**

### 3. Update google-services.json

1. After adding SHA-1, download the updated `google-services.json` from Firebase Console
2. Replace the file at: `android/app/google-services.json` (or root `google-services.json`)
3. Also update the one in the root directory if it exists

### 4. Rebuild the App

```bash
npx expo run:android
```

## Alternative: Using Expo's Built-in Command

If you're using Expo, you can also get SHA-1 using:

```bash
npx expo run:android --variant debug
```

And check the build output for SHA-1.

## Important Notes

- **Debug vs Release**: You need different SHA-1 fingerprints for debug and release builds
- **Multiple SHA-1s**: You can add multiple SHA-1 fingerprints in Firebase Console (one for debug, one for release)
- **Wait Time**: After adding SHA-1, it may take a few minutes for changes to propagate

## Verification

After adding SHA-1 and rebuilding, try Google Sign-In again. The error should be resolved.

If you still get errors, verify:
1. Package name matches: `com.saibabamiracles.app`
2. `google-services.json` is in the correct location
3. You've rebuilt the app after updating `google-services.json`
4. SHA-1 fingerprint is correctly formatted (can use with or without colons)

