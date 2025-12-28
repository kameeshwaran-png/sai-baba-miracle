# Firebase OAuth Domain Whitelisting Guide

## Current Firebase Configuration

- **Project ID**: `saibaba-community`
- **Auth Domain**: `saibaba-community.firebaseapp.com`
- **App Slug**: `sai-baba-miracles`
- **Bundle ID (iOS)**: `com.saibabamiracles.app`
- **Package (Android)**: `com.saibabamiracles.app`

## Domains/URIs to Whitelist

### 1. Firebase Console → Authentication → Settings → Authorized domains

Add these domains:
- `saibaba-community.firebaseapp.com` (already added by default)
- `localhost` (for local development)
- Your custom domain (if deploying web version)

### 2. Google OAuth (Google Cloud Console)

**Authorized JavaScript origins:**
- `https://saibaba-community.firebaseapp.com`
- `http://localhost:8081` (for development)
- Your web domain (if applicable)

**Authorized redirect URIs:**
- `https://saibaba-community.firebaseapp.com/__/auth/handler`
- `exp://localhost:8081`
- `exp://127.0.0.1:8081`
- `https://auth.expo.io/@YOUR_EXPO_USERNAME/sai-baba-miracles` (replace YOUR_EXPO_USERNAME)
- `com.saibabamiracles.app://` (for production builds)

### 3. Facebook OAuth (Facebook Developers)

**Valid OAuth Redirect URIs:**
- `https://saibaba-community.firebaseapp.com/__/auth/handler`
- `exp://localhost:8081`
- `exp://127.0.0.1:8081`
- `https://auth.expo.io/@YOUR_EXPO_USERNAME/sai-baba-miracles`
- `com.saibabamiracles.app://`

### 4. Apple Sign In (Apple Developer)

**Return URLs:**
- `https://saibaba-community.firebaseapp.com/__/auth/handler`
- `com.saibabamiracles.app://`

## Finding Your Expo Username

To find your Expo username for the auth.expo.io URL:

```bash
npx expo whoami
```

Or check your Expo account at https://expo.dev

## Notes

- For **Expo Go** development: Use `exp://localhost:8081` or `exp://127.0.0.1:8081`
- For **production builds**: Use your app's custom scheme `com.saibabamiracles.app://`
- For **web deployment**: Add your actual web domain
- The Firebase auth handler URL (`https://saibaba-community.firebaseapp.com/__/auth/handler`) is required for all OAuth providers

## Testing

After adding domains, test OAuth flows:
1. Development: Test with Expo Go using `exp://localhost:8081`
2. Production: Test with production build using `com.saibabamiracles.app://`

