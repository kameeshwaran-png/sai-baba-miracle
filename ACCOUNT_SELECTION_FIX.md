# Fix: Google OAuth Not Showing Account Selection

## Problem
The Google OAuth flow is not showing the account selection screen and is automatically using a cached account (`pickaar.in@gmail.com`).

## Root Cause
Even with `prompt: 'select_account'` parameter, Google may use cached browser sessions in Expo Go, especially if:
1. The user is already signed into Google in their browser
2. The browser has cached the OAuth session
3. The prompt parameter isn't being properly passed to Google's OAuth endpoint

## Solution Implemented

### 1. Code Changes
- Added `prompt: 'select_account consent'` in `extraParams`
- Added `showInRecents: false` to prevent browser session caching
- Added code to dismiss any existing browser sessions before OAuth

### 2. Manual Steps to Force Account Selection

**Option A: Clear Browser Data (Recommended)**
1. In Expo Go, when the OAuth browser opens
2. Look for browser settings/menu (usually three dots)
3. Clear browsing data/cookies for `accounts.google.com`
4. Try signing in again

**Option B: Use Incognito/Private Mode**
- Unfortunately, Expo Go doesn't support incognito mode directly
- You may need to clear browser data manually

**Option C: Sign Out from Google First**
1. Before tapping "Continue with Google"
2. Open a browser and go to `accounts.google.com`
3. Sign out from all Google accounts
4. Then try signing in through the app

**Option D: Add All Accounts as Test Users**
1. Go to Google Cloud Console → OAuth consent screen
2. Add ALL accounts you want to test as test users:
   - `pickaar.in@gmail.com`
   - `kameeshwaran@gmail.com`
   - `vanithamurugan141093@gmail.com`
   - Any other accounts you want to test
3. This ensures all accounts can sign in

## Verification

To verify the prompt parameter is working:

1. Check the console logs when you tap "Continue with Google"
2. Look for the authorization URL in the logs
3. Verify it contains `prompt=select_account+consent`

## Alternative: Use Different Account

If account selection still doesn't show:
1. Sign out from `pickaar.in@gmail.com` in your device's browser
2. Or use one of the test accounts that's already added:
   - `kameeshwaran@gmail.com`
   - `vanithamurugan141093@gmail.com`

## Testing

1. **Clear browser cache** in Expo Go (if possible)
2. **Sign out from Google** in your device browser
3. **Restart the app**: `npm start -- --clear`
4. **Try signing in** - you should now see the account selection screen

## Expected Behavior

After the fix, when you tap "Continue with Google":
1. ✅ Google OAuth page opens
2. ✅ Account selection screen appears (showing all available accounts)
3. ✅ You can choose any account from the list
4. ✅ After selection, consent screen appears
5. ✅ Then redirects back to app

## If Still Not Working

If account selection still doesn't appear:
1. **Check test users**: Ensure the account is in the test users list
2. **Clear Expo Go cache**: Uninstall and reinstall Expo Go app
3. **Use physical device**: Test on a real device instead of simulator
4. **Check OAuth consent screen**: Ensure it's properly configured in Google Cloud Console

