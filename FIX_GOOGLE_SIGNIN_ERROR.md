# Fix: "A non-recoverable sign in failure occurred"

## Your SHA-1 Fingerprint
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

## Quick Fix Steps

### 1. Add SHA-1 to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **saibaba-community**
3. Click ⚙️ (gear icon) → **Project Settings**
4. Scroll to **Your apps** section
5. Find Android app: `com.saibabamiracles.app`
6. Click **Add fingerprint** button
7. Paste this SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
   - You can paste with or without colons (both formats work)
8. Click **Save**

### 2. Download Updated google-services.json

1. After adding SHA-1, scroll down in the same page
2. Click **Download google-services.json**
3. Replace the file in your project:
   - `android/app/google-services.json`
   - Root `google-services.json` (if it exists)

### 3. Rebuild the App

```bash
# Clean and rebuild
npx expo prebuild --clean
npx expo run:android
```

### 4. Test Google Sign-In

After rebuilding, try Google Sign-In again. The error should be resolved.

## Alternative: If Still Not Working

If you still get the error after adding SHA-1:

1. **Verify Package Name**: Ensure `com.saibabamiracles.app` matches in:
   - `app.json` (android.package)
   - Firebase Console
   - `google-services.json`

2. **Check google-services.json Location**: 
   - Should be at: `android/app/google-services.json`
   - Also check root directory if using Expo

3. **Wait a Few Minutes**: Firebase changes can take 2-5 minutes to propagate

4. **Check Error Code**: The improved error handling will now show more specific error messages

## What Changed

I've updated the error handling in `SignUpScreen.js` to:
- Show more helpful error messages
- Specifically detect the "non-recoverable sign in failure" error
- Provide guidance on what needs to be fixed

## Verification Checklist

- [ ] SHA-1 fingerprint added to Firebase Console
- [ ] Updated `google-services.json` downloaded and placed correctly
- [ ] App rebuilt after updating `google-services.json`
- [ ] Package name matches: `com.saibabamiracles.app`
- [ ] Google Sign-In enabled in Firebase Console → Authentication → Sign-in method

