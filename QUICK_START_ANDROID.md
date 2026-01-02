# Quick Start: Running on Android

You have two main options to run your app on Android:

## Option 1: Use Expo Go (Quickest - BUT won't work with Google Sign-In)

Since you're using `@react-native-google-signin/google-signin`, this option **won't work** for Google Sign-In, but you can use it for other testing:

```bash
npx expo start
```

Then scan QR code with Expo Go app.

**⚠️ Note**: Google Sign-In requires native code, so you need Option 2 below.

---

## Option 2: Android Emulator (Required for Google Sign-In)

### Quick Setup Steps:

1. **Install Android Studio** (if not installed):
   - Download: https://developer.android.com/studio
   - Install with default settings

2. **Create an Emulator**:
   - Open Android Studio
   - Click **More Actions** → **Virtual Device Manager**
   - Click **Create Device**
   - Choose **Pixel 5** or **Pixel 6**
   - Select **API 33** or **API 34** (with Google Play)
   - Click **Finish**

3. **Start the Emulator**:
   - In Virtual Device Manager, click **Play** button (▶️)
   - Wait for emulator to boot (1-2 minutes first time)

4. **Run Your App**:
   ```bash
   npx expo run:android
   ```

---

## Option 3: Physical Android Device

1. **On your Android phone**:
   - Settings → About phone → Tap "Build number" 7 times
   - Settings → Developer options → Enable "USB debugging"

2. **Connect via USB**:
   - Connect phone to computer
   - Allow USB debugging on phone

3. **Install ADB tools** (if needed):
   ```bash
   brew install --cask android-platform-tools
   ```

4. **Verify connection**:
   ```bash
   adb devices
   ```
   Should show your device.

5. **Run app**:
   ```bash
   npx expo run:android
   ```

---

## Current Status

Based on your system, you need to:
1. ✅ Install Android Studio (if not installed)
2. ✅ Create an Android Emulator
3. ✅ Start the emulator
4. ✅ Run `npx expo run:android`

The app will automatically detect the running emulator or connected device.

