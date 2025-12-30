# iOS Build Error Fix - EXConstants Script Failure

## Error
```
PhaseScriptExecution [CP-User]\ Generate\ app.config\ for\ prebuilt\ Constants.manifest
```

This error occurs when the EXConstants build script can't generate the app config during the iOS build process.

## Solutions Applied

### 1. Clean and Regenerate iOS Project
```bash
npx expo prebuild --clean --platform ios
```

### 2. Clean Derived Data
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/SaiBabaMiracles-*
rm -rf ios/build
```

### 3. Reinstall CocoaPods
```bash
cd ios
pod install
```

## Additional Solutions to Try

### If Build Still Fails:

**Option 1: Use EAS Build (Recommended for Production)**
```bash
npx eas build --platform ios
```
This uses Expo's cloud build service which avoids local environment issues.

**Option 2: Build from Xcode Directly**
1. Open `ios/SaiBabaMiracles.xcworkspace` in Xcode
2. Select a simulator or device
3. Press Cmd+B to build, or Cmd+R to run
4. This will show more detailed error messages

**Option 3: Check Node Path (if using nvm)**
If you're using nvm, Xcode build scripts might not find node. You can:
- Create a symlink (requires sudo):
  ```bash
  sudo ln -sf ~/.nvm/versions/node/v22.17.1/bin/node /usr/local/bin/node
  ```
- Or use a standard Node.js installation instead of nvm

**Option 4: Use Expo Go for Development**
Instead of building locally, you can use Expo Go:
```bash
npm start
```
Then scan the QR code with Expo Go app on your device.

## Current Status
- ✅ Pods reinstalled
- ✅ iOS project regenerated
- ✅ Dependencies installed
- ⚠️ Local build may still fail due to Node path issues with nvm

## Recommendation
For development, use **Expo Go** (easiest). For production builds, use **EAS Build** (most reliable).

