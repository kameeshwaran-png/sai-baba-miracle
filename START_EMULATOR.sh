#!/bin/bash
# Quick script to start Android emulator

echo "🚀 Starting Android Emulator: Pixel_3a_API_34"
echo ""

# Add Android SDK to PATH if not already there
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator

# Start the emulator in background
~/Library/Android/sdk/emulator/emulator -avd Pixel_3a_API_34 &

echo "⏳ Emulator is starting... This may take 1-2 minutes."
echo "📱 Once the emulator is fully booted, run: npx expo run:android"
echo ""
echo "💡 To check if emulator is ready, run: adb devices"

