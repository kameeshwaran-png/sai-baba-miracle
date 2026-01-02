# Android Device/Emulator Setup

You need either a physical Android device or an emulator to run the app.

## Option 1: Use Android Emulator (Recommended for Development)

### Step 1: Install Android Studio

1. Download and install [Android Studio](https://developer.android.com/studio)
2. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Step 2: Create an Android Virtual Device (AVD)

1. Open Android Studio
2. Click **More Actions** → **Virtual Device Manager** (or Tools → Device Manager)
3. Click **Create Device**
4. Select a device (e.g., **Pixel 5** or **Pixel 6**)
5. Click **Next**
6. Select a system image (recommended: **API 33** or **API 34** with Google Play)
7. Click **Download** if needed, then **Next**
8. Click **Finish**

### Step 3: Start the Emulator

1. In Android Studio, go to **Virtual Device Manager**
2. Click the **Play** button (▶️) next to your emulator
3. Wait for the emulator to start (may take 1-2 minutes first time)

### Step 4: Run Your App

Once the emulator is running, go back to your terminal and run:

```bash
npx expo run:android
```

The app should automatically detect and install on the emulator.

---

## Option 2: Use Physical Android Device

### Step 1: Enable Developer Options

1. On your Android device, go to **Settings** → **About phone**
2. Tap **Build number** 7 times until you see "You are now a developer!"

### Step 2: Enable USB Debugging

1. Go to **Settings** → **System** → **Developer options**
2. Enable **USB debugging**
3. Enable **Install via USB** (if available)

### Step 3: Connect Your Device

1. Connect your Android device to your computer via USB
2. On your device, when prompted, allow USB debugging
3. Check "Always allow from this computer" if available

### Step 4: Verify Connection

In your terminal, run:

```bash
adb devices
```

You should see your device listed. Example:
```
List of devices attached
ABC123XYZ    device
```

If you see "unauthorized", check your device and allow USB debugging.

### Step 5: Run Your App

```bash
npx expo run:android
```

---

## Troubleshooting

### Emulator Won't Start

1. **Check HAXM/HAXM is installed** (Intel Macs):
   ```bash
   # Check if virtualization is enabled in BIOS/UEFI
   ```

2. **For Apple Silicon (M1/M2/M3 Macs)**:
   - Make sure you're using ARM64 system images
   - Use API 30+ for better compatibility

3. **Increase Emulator RAM**:
   - Edit your AVD in Android Studio
   - Increase RAM allocation (recommended: 2048 MB or more)

### Device Not Detected

1. **Check USB connection**:
   ```bash
   adb devices
   ```

2. **Restart ADB server**:
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```

3. **Try different USB cable** (some cables are charge-only)

4. **Install USB drivers** (Windows only):
   - Install device-specific USB drivers
   - Or use [Universal ADB Driver](https://adb.clockworkmod.com/)

### "adb: command not found"

Install Android SDK Platform Tools:

1. **Using Homebrew (macOS)**:
   ```bash
   brew install --cask android-platform-tools
   ```

2. **Or add to PATH**:
   - Android SDK location: `~/Library/Android/sdk/platform-tools`
   - Add to `~/.zshrc` or `~/.bash_profile`:
     ```bash
     export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools
     ```
   - Then reload: `source ~/.zshrc`

### Using Expo Go (Alternative - No Native Build Required)

If you just want to test quickly without building native code:

```bash
npx expo start
```

Then scan the QR code with Expo Go app on your Android device.

**Note**: Expo Go won't work with `@react-native-google-signin/google-signin` since it requires native code. You need a development build for Google Sign-In.

---

## Quick Commands

```bash
# Check connected devices
adb devices

# Restart ADB server
adb kill-server && adb start-server

# List all emulators
emulator -list-avds

# Start specific emulator
emulator -avd <emulator_name>

# Run app on Android
npx expo run:android
```

