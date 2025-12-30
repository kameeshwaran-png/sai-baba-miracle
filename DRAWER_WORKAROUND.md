# Drawer Navigator Workaround

## Current Issue

The drawer navigator is not working due to a Reanimated 3/4 compatibility issue with `@react-navigation/drawer@6.7.2`. The drawer library is trying to auto-detect Reanimated and incorrectly defaults to legacy implementation, which is not supported in Reanimated 3+.

## Temporary Solution Applied

I've temporarily replaced the drawer navigator with a stack navigator for testing purposes. The app will now use `MainStack` directly instead of wrapping it in a drawer.

## To Access Settings

Since we're not using a drawer, you can:
1. Add a Settings button to the Dashboard header
2. Navigate to Settings programmatically from another screen
3. Or restore the drawer once the Reanimated issue is fixed

## To Restore Drawer (After Fixing Reanimated)

In `src/navigation/AppNavigator.js`, change:
```javascript
const USE_DRAWER = false;
```
to:
```javascript
const USE_DRAWER = true;
```

## Permanent Fix Needed

The drawer library needs to properly detect Reanimated 4. This might require:
1. Updating to a newer version of @react-navigation/drawer that supports Reanimated 4
2. Or downgrading react-native-reanimated to v3 (not recommended)
3. Or waiting for a fix from the React Navigation team

For now, using Stack navigation allows the app to function properly for testing.

