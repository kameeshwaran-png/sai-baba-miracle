# Testing Bypass - Skip Login

## Current Status

✅ **LOGIN IS CURRENTLY BYPASSED FOR TESTING**

The app will go directly to the Dashboard screen, skipping the SignUp/Splash screens.

## How to Disable the Bypass

To re-enable authentication (remove the bypass), edit `src/navigation/AppNavigator.js`:

Find this line:
```javascript
const SKIP_LOGIN_FOR_TESTING = true;
```

Change it to:
```javascript
const SKIP_LOGIN_FOR_TESTING = false;
```

## Important Notes

1. **This bypass only affects navigation** - it doesn't set a fake user in Redux
2. **Some features may not work** without a real user (like creating posts, liking, etc.)
3. **Remember to disable this before production!**

## What This Does

- ✅ Bypasses the SplashScreen loading check
- ✅ Bypasses the SignUp screen
- ✅ Goes directly to Dashboard
- ⚠️ No user data is set in Redux (you'll need to handle null user checks in components)

