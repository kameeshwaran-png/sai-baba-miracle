# Fix Google OAuth "Access blocked" Error

## Problem
Getting "Access blocked: Authorization Error" - "You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy"

## Solution

### Step 1: Add All Required Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **SaiBaba-community**
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your **Web client** OAuth 2.0 Client ID:
   - `646552958318-4575892dr8trf7i56tdq7do6fggt3637.apps.googleusercontent.com`
5. Under **Authorized redirect URIs**, add ALL of these URIs (one at a time):

   **For Expo Go (Development):**
   ```
   https://auth.expo.io/@kameeshwaran89/sai-baba-miracles
   ```
   
   **For Local Development:**
   ```
   exp://localhost:8081
   exp://127.0.0.1:8081
   exp://192.168.1.80:8081
   ```
   
   **For Production Builds:**
   ```
   com.saibabamiracles.app://
   ```
   
   **For Firebase Auth Handler:**
   ```
   https://saibaba-community.firebaseapp.com/__/auth/handler
   ```

6. **IMPORTANT**: Make sure there are NO trailing slashes (except for the custom scheme one)
7. Click **SAVE** after adding each URI

**Note**: The redirect URI that's actually being used will be logged in the console. Check your app's console logs to see which one is being generated, then make sure that EXACT URI is in the list above.

### Step 2: Verify Test Users (if app is in Testing mode)

1. Go to **APIs & Services** → **OAuth consent screen**
2. Scroll down to **Test users** section
3. Make sure `pickaar.in@gmail.com` is in the test users list
4. If not, click **"+ ADD USERS"** and add:
   - `pickaar.in@gmail.com`
   - Any other emails you want to test with

### Step 3: Complete OAuth Consent Screen (if missing info)

1. Go to **APIs & Services** → **OAuth consent screen**
2. Ensure these fields are filled:
   - **App name**: Sai Baba Miracles (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **App logo** (optional but recommended)
   - **App domain** (optional)
   - **Authorized domains**: Add `expo.io` if not already there

### Step 4: Publish App (Optional - for production)

If you want any Google user to sign in (not just test users):

1. Go to **APIs & Services** → **OAuth consent screen**
2. Click **"PUBLISH APP"** button
3. Note: This requires app verification if you request sensitive scopes

## Current Configuration

- **Expo Username**: `kameeshwaran89`
- **App Slug**: `sai-baba-miracles`
- **Expo Proxy Redirect URI**: `https://auth.expo.io/@kameeshwaran89/sai-baba-miracles`
- **Web Client ID**: `646552958318-4575892dr8trf7i56tdq7do6fggt3637.apps.googleusercontent.com`
- **iOS Client ID**: `646552958318-aukbcpnkl451p7vfcfc8g4p85e5f2l3j.apps.googleusercontent.com`

## After Making Changes

1. Wait 1-2 minutes for changes to propagate
2. Try signing in again
3. If still not working, check:
   - The redirect URI matches exactly (no trailing slashes)
   - Test user email is correct
   - OAuth consent screen is properly configured

## Additional Redirect URIs to Add (if needed)

For different environments, you may also want to add:

- `https://auth.expo.io/@kameeshwaran89/sai-baba-miracles` (Expo proxy - REQUIRED)
- `exp://localhost:8081` (Local development)
- `exp://127.0.0.1:8081` (Local development)
- `com.saibabamiracles.app://` (Production builds)

