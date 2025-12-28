# Fix OAuth "Access blocked" Error

## Problem
You're getting "Access blocked: Authorization Error" because the account trying to sign in (`pickaar.in@gmail.com`) is not in your test users list.

## Solution: Add Test Users

### Step 1: Add the User to Test Users List

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **SaiBaba-community**
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Scroll down to **Test users** section
5. Click **"+ Add users"** button
6. Add the email: `pickaar.in@gmail.com`
7. Click **Add**

### Step 2: Current Test Users
Your current test users are:
- `kameeshwaran@gmail.com` ✅
- `vanithamurugan141093@gmail.com` ✅
- `pickaar.in@gmail.com` ❌ (needs to be added)

### Step 3: Alternative - Use Existing Test Account
If you don't want to add more test users, you can:
- Sign in with `kameeshwaran@gmail.com` or `vanithamurugan141093@gmail.com`
- These accounts are already in the test users list

## Additional Requirements for Testing Mode

When your app is in **Testing** mode:
- Only users in the test users list can sign in
- Maximum 100 test users allowed
- You're currently at 2/100 users

## Publishing Your App (For Production)

When ready for production:
1. Complete OAuth consent screen configuration:
   - Add app name, logo, support email
   - Configure scopes
   - Add privacy policy and terms of service URLs
2. Click **"Publish app"** button in OAuth consent screen
3. This allows any Google user to sign in (not just test users)

## Important Notes

- **Testing Mode**: Only test users can sign in
- **Published Mode**: Any Google user can sign in (requires verification for sensitive scopes)
- **User Cap**: 100 users max in testing mode (lifetime limit)

## Quick Fix

**Right now, to test immediately:**
1. Add `pickaar.in@gmail.com` to test users, OR
2. Use `kameeshwaran@gmail.com` or `vanithamurugan141093@gmail.com` to sign in

