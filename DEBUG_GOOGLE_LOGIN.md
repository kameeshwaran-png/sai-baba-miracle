# Debugging Google Login in Expo Go

## Issue Fixed

The code was using `request.exchangeCodeAsync()` which doesn't exist in the expo-auth-session API. It's been updated to use `AuthSession.exchangeCodeAsync()` instead.

## How to Debug

### 1. Check Console Logs

In Expo Go, you can see console logs:

**On your computer (terminal where you ran `npm start`):**
- All `console.log()` statements will appear here
- Look for logs starting with:
  - "Starting OAuth flow with redirectUri:"
  - "OAuth result type:"
  - "Received authorization code..."
  - Any error messages

**In Expo Go app:**
- Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) in simulator
- Select "Debug Remote JS" to see logs in browser console
- Or check the terminal where you ran `npm start`

### 2. What Should Happen

When you click "Continue with Google":
1. ✅ Loading spinner appears (this is working)
2. ✅ Browser should open with Google sign-in page
3. ✅ You select/enter your Google account
4. ✅ Browser redirects back to the app
5. ✅ App processes the authentication

### 3. If Browser Doesn't Open

This could mean:
- The OAuth flow isn't starting properly
- Check the console logs for errors
- Make sure you have internet connection
- Try restarting Expo Go app

### 4. If Browser Opens But Gets Stuck

- Check if Google is showing any error messages
- Make sure the redirect URI is properly configured in Google Cloud Console
- Verify the Client ID is correct
- Check console logs for specific error messages

### 5. Common Issues in Expo Go

**Issue: Browser opens but immediately closes**
- This might be a redirect URI mismatch
- Check that your redirect URI in Google Console matches what's being used
- The redirect URI with `useProxy: true` should be something like: `https://auth.expo.io/@kameeshwaran89/sai-baba-miracles`

**Issue: "Access blocked" error**
- Make sure your email is added to test users in Google Cloud Console
- Check GOOGLE_OAUTH_SETUP.md for details

**Issue: Loading forever**
- Check console logs to see where it's stuck
- The new logging will show:
  - "Starting OAuth flow..." = Flow started
  - "OAuth result type: success" = Browser redirect worked
  - "Received authorization code..." = Code received
  - "Token exchange result: Success" = Token received
  - "Firebase sign-in successful" = Complete!

### 6. Next Steps

1. **Restart your app** to get the updated code:
   ```bash
   # Stop the current server (Ctrl+C)
   npm start
   # Reload the app in Expo Go (shake device, select "Reload")
   ```

2. **Try the login again** and watch the console logs

3. **If still not working**, share the console logs and I can help debug further

## Alternative: Use Development Build

If OAuth continues to have issues in Expo Go, consider building a development build:
```bash
npx eas build --platform android --profile development
```

This gives you more control and better OAuth support than Expo Go.

