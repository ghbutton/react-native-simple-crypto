# React Native Simple Crypto - Test App

This is a minimal React Native test app that demonstrates and tests the `react-native-simple-crypto` library in a real React Native environment.

## Features

- **Interactive Testing**: Tap the "Run All Tests" button to test all crypto functions
- **Real-time Results**: See test results displayed in the app
- **Comprehensive Coverage**: Tests all major crypto functions:
  - Random Bytes generation
  - SHA-1, SHA-256, SHA-512 hashing
  - AES encryption/decryption
  - HMAC-SHA256
  - PBKDF2 password hashing
  - RSA key generation, encryption/decryption
  - Utility functions (conversions)

## Setup

1. **Install dependencies:**
   ```bash
   npm run test-app:install
   ```

2. **Start Metro bundler:**
   ```bash
   npm run test-app:start
   ```

3. **Run on iOS:**
   ```bash
   npm run test-app:ios
   ```

4. **Run on Android:**
   ```bash
   npm run test-app:android
   ```

## Usage

1. Launch the app on your device/simulator
2. Tap the "Run All Tests" button
3. Watch the test results appear in real-time
4. All tests should pass with ✅ indicators

## What This Tests

- **Native Module Integration**: Verifies the library works with real native modules
- **Cross-platform Compatibility**: Tests work on both iOS and Android
- **Real Device Performance**: Tests actual performance on devices
- **User Interface**: Provides a visual way to verify functionality

## Benefits

- **E2E Testing**: Tests the library in a real React Native environment
- **Visual Feedback**: See results immediately in the app
- **Debugging**: Easy to identify which functions work/don't work
- **Demonstration**: Shows how to use the library in a real app

This test app complements the unit tests by providing end-to-end testing in a real React Native environment.
