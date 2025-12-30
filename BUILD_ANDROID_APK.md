# Building Android APK for Physical Device

## Quick Build Command

Run this command to build an APK:

```bash
npx eas build --platform android --profile preview
```

## What Will Happen

1. **Keystore Generation**: EAS will ask if you want to generate a new Android keystore. Type `y` and press Enter (this is a one-time setup).
2. **Build Process**: EAS will build your app in the cloud (this takes 5-15 minutes).
3. **Download**: Once complete, you'll get a download link for the APK file.

## Installing on Your Device

1. Download the APK from the build link (sent to your email or shown in terminal).
2. Transfer the APK to your Android device (via USB, email, or cloud storage).
3. On your device:
   - Open Settings → Security
   - Enable "Install from Unknown Sources" or "Allow from this source"
   - Open the APK file and tap "Install"

## Build Configuration

The `eas.json` has been configured to:
- Build APK format (not AAB) for easy installation
- Use the "preview" profile for internal distribution
- Generate credentials automatically on first build

## Alternative: Build Development Client

If you want a development build (with hot reload and debugging):

```bash
npx eas build --platform android --profile development
```

This creates a development client that connects to your Metro bundler.

## Check Build Status

After starting a build, you can:
- Check status in terminal
- Visit: https://expo.dev/accounts/kameeshwaran89/projects/sai-baba-miracles/builds
- Run: `npx eas build:list` to see your builds

