# Not maintained, looking for maintainer. Contact @ghbutton if you want take charge.

# React Native Simple Crypto [![npm version](https://badge.fury.io/js/react-native-simple-crypto.svg)](https://badge.fury.io/js/react-native-simple-crypto)

A simpler React-Native crypto library

## Features

- AES-128-CBC
- HMAC-SHA256
- SHA1
- SHA256
- SHA512
- PBKDF2
- RSA

## Installation

```bash
npm install react-native-simple-crypto

# OR

yarn add react-native-simple-crypto
```

### Linking Automatically

```bash
react-native link react-native-simple-crypto
```

### Linking Manually

#### iOS

- See [Linking Libraries](http://facebook.github.io/react-native/docs/linking-libraries-ios.html)
  OR
- Drag RCTCrypto.xcodeproj to your project on Xcode.
- Click on your main project file (the one that represents the .xcodeproj) select Build Phases and drag libRCTCrypto.a from the Products folder inside the RCTCrypto.xcodeproj.

#### (Android)

- In `android/settings.gradle`

```gradle
...
include ':react-native-simple-crypto'
project(':react-native-simple-crypto').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-simple-crypto/android')
```

- In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-simple-crypto')
}
```

- register module (in MainApplication.java)

```java
......
import com.pedrouid.crypto.RNSCCryptoPackage;

......

@Override
protected List<ReactPackage> getPackages() {
   ......
   new RNSCCryptoPackage(),
   ......
}
```

## API

All methods are asynchronous and return promises (except for convert utils)

```typescript
- AES
  - encrypt(text: ArrayBuffer, key: ArrayBuffer, iv: ArrayBuffer)
  - decrypt(cipherText: ArrayBuffer, key: ArrayBuffer, iv: ArrayBuffer)
- SHA
  - sha1(text: string)
  - sha1(text: ArrayBuffer)
  - sha256(text: string)
  - sha256(text: ArrayBuffer)
  - sha512(text: string)
  - sha512(text: ArrayBuffer)
- HMAC
  - hmac256(text: ArrayBuffer, key: ArrayBuffer)
- PBKDF2
  - hash(password: string, salt: ArrayBuffer, iterations: number, keyLength: number, hash: string)
- RSA
  - generateKeys(keySize: number)
  - sign(data: string, key: string, hash: string)
  - verify(data: string, secretToVerify: string, hash: string)
  - encrypt(data: string, key: string) (Expects UTF8 string data inputs)
  - decrypt(data: string, key: string) (Returns UTF8 string)
  - encrypt64(data: string, key: string) (Expects Base64 string data inputs)
  - decrypt64(data: string, key: string) (Returns Base64 string)
- utils
  - randomBytes(bytes: number)
  - convertArrayBufferToUtf8(input: ArrayBuffer)
  - convertUtf8ToArrayBuffer(input: string)
  - convertArrayBufferToBase64(input: ArrayBuffer)
  - convertBase64ToArrayBuffer(input: string)
  - convertArrayBufferToHex(input: ArrayBuffer)
  - convertHexToArrayBuffer(input: string)
```

> _NOTE:_ Supported hashing algorithms for RSA and PBKDF2 are:
>
> `"Raw" (RSA-only) | "SHA1" | "SHA224" | "SHA256" | "SHA384" | "SHA512"`

## Testing

This library includes comprehensive unit tests for all public functions. The testing setup provides fast feedback during development and ensures code quality.

### Quick Start

```bash
# Install dependencies
npm install

# Run all unit tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Advanced Testing

#### **End-to-End Testing with Test App**

This repository includes a minimal React Native test app for E2E testing:

```bash
# Install test app dependencies
npm run test-app:install

# Start Metro bundler
npm run test-app:start

# Run on iOS simulator
npm run test-app:ios

# Run on Android emulator
npm run test-app:android
```

The test app provides:
- **Interactive Testing**: Tap to run all crypto functions
- **Real-time Results**: See test results in the app
- **Native Module Testing**: Tests with real native modules
- **Cross-platform Verification**: Works on iOS and Android

#### **Platform-Specific Testing**

```bash
# Test on iOS simulator
npm run test:ios

# Test on Android emulator
npm run test:android

# Test on both platforms
npm run test:all-platforms
```

### Benefits

- **Fast Development**: Unit tests run in milliseconds
- **No Simulators Required**: Tests run in Node.js environment
- **Comprehensive Coverage**: All public functions tested
- **Edge Case Handling**: Tests handle empty inputs and special cases
- **CI/CD Ready**: Can run on any platform without simulators
- **Maintainable**: Well-organized test structure

### Test Structure

```
├── __tests__/
│   └── crypto.test.js          # Comprehensive unit tests
├── test-app/                   # E2E test app
│   ├── src/
│   │   └── App.tsx            # Interactive test app
│   ├── package.json           # Test app dependencies
│   └── README.md              # Test app documentation
├── jest.setup.js               # Jest configuration and mocks
└── package.json               # Test scripts and dependencies
```

### Migration from Separate Test Repo

If you're currently using a separate test repository like [react-native-simple-crypto-test](https://github.com/ghbutton/react-native-simple-crypto-test), you can:

1. **Keep E2E tests**: Use Detox for comprehensive testing
2. **Add unit tests**: Fast feedback during development
3. **Improve CI**: Run unit tests on every commit
4. **Reduce complexity**: Single repository for all code

### Running Tests in CI/CD

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Example

Testing [repository](https://github.com/ghbutton/react-native-simple-crypto-test).

```javascript
import RNSimpleCrypto from "react-native-simple-crypto";

const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex
const toUtf8 = RNSimpleCrypto.utils.convertArrayBufferToUtf8

// -- AES ------------------------------------------------------------- //
const message = "data to encrypt";
const messageArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(
  message
);

const keyArrayBuffer = await RNSimpleCrypto.utils.randomBytes(32);
console.log("randomBytes key", toHex(keyArrayBuffer));

const ivArrayBuffer = await RNSimpleCrypto.utils.randomBytes(16);
console.log("randomBytes iv", toHex(ivArrayBuffer));

const cipherTextArrayBuffer = await RNSimpleCrypto.AES.encrypt(
  messageArrayBuffer,
  keyArrayBuffer,
  ivArrayBuffer
);
console.log("AES encrypt", toHex(cipherTextArrayBuffer))

const decryptedArrayBuffer = await RNSimpleCrypto.AES.decrypt(
  cipherTextArrayBuffer,
  keyArrayBuffer,
  ivArrayBuffer
);
console.log("AES decrypt", toUtf8(decryptedArrayBuffer));
if (toUtf8(decryptedArrayBuffer) !== message) {
  console.error('AES decrypt returned unexpected results')
}

// -- HMAC ------------------------------------------------------------ //

const keyHmac = await RNSimpleCrypto.utils.randomBytes(32);
const signatureArrayBuffer = await RNSimpleCrypto.HMAC.hmac256(messageArrayBuffer, keyHmac);
console.log("HMAC signature", toHex(signatureArrayBuffer));

// -- SHA ------------------------------------------------------------- //

const sha1Hash = await RNSimpleCrypto.SHA.sha1("test");
console.log("SHA1 hash", sha1Hash);

const sha256Hash = await RNSimpleCrypto.SHA.sha256("test");
console.log("SHA256 hash", sha256Hash);

const sha512Hash = await RNSimpleCrypto.SHA.sha512("test");
console.log("SHA512 hash", sha512Hash);

const arrayBufferToHash = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer("test");
const sha1ArrayBuffer = await RNSimpleCrypto.SHA.sha1(arrayBufferToHash);
console.log('SHA1 hash bytes', toHex(sha1ArrayBuffer));
if (toHex(sha1ArrayBuffer) !== sha1Hash) {
  console.error('SHA1 result mismatch!')
}

const sha256ArrayBuffer = await RNSimpleCrypto.SHA.sha256(arrayBufferToHash);
console.log('SHA256 hash bytes', toHex(sha256ArrayBuffer));
if (toHex(sha256ArrayBuffer) !== sha256Hash) {
  console.error('SHA256 result mismatch!')
}

const sha512ArrayBuffer = await RNSimpleCrypto.SHA.sha512(arrayBufferToHash);
console.log('SHA512 hash bytes', toHex(sha512ArrayBuffer));
if (toHex(sha512ArrayBuffer) !== sha512Hash) {
  console.error('SHA512 result mismatch!')
}

// -- PBKDF2 ---------------------------------------------------------- //

const password = "secret password";
const salt = "my-salt"
const iterations = 4096;
const keyInBytes = 32;
const hash = "SHA1";
const passwordKey = await RNSimpleCrypto.PBKDF2.hash(
  password,
  salt,
  iterations,
  keyInBytes,
  hash
);
console.log("PBKDF2 passwordKey", toHex(passwordKey));

const passwordKeyArrayBuffer = await RNSimpleCrypto.PBKDF2.hash(
  RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(password),
  RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(salt),
  iterations,
  keyInBytes,
  hash
);
console.log("PBKDF2 passwordKey bytes", toHex(passwordKeyArrayBuffer));

if (toHex(passwordKeyArrayBuffer) !== toHex(passwordKey)) {
  console.error('PBKDF2 result mismatch!')
}

const password2 = messageArrayBuffer;
const salt2 = await RNSimpleCrypto.utils.randomBytes(8);
const iterations2 = 10000;
const keyInBytes2 = 32;
const hash2 = "SHA256";

const passwordKey2 = await RNSimpleCrypto.PBKDF2.hash(
  password2,
  salt2,
  iterations2,
  keyInBytes2,
  hash2
);
console.log("PBKDF2 passwordKey2", toHex(passwordKey2));


// -- RSA ------------------------------------------------------------ //

const rsaKeys = await RNSimpleCrypto.RSA.generateKeys(1024);
console.log("RSA1024 private key", rsaKeys.private);
console.log("RSA1024 public key", rsaKeys.public);

const rsaEncryptedMessage = await RNSimpleCrypto.RSA.encrypt(
  message,
  rsaKeys.public
);
console.log("rsa Encrypt:", rsaEncryptedMessage);

const rsaSignature = await RNSimpleCrypto.RSA.sign(
  rsaEncryptedMessage,
  rsaKeys.private,
  "SHA256"
);
console.log("rsa Signature:", rsaSignature);

const validSignature = await RNSimpleCrypto.RSA.verify(
  rsaSignature,
  rsaEncryptedMessage,
  rsaKeys.public,
  "SHA256"
);
console.log("rsa signature verified:", validSignature);

const rsaDecryptedMessage = await RNSimpleCrypto.RSA.decrypt(
  rsaEncryptedMessage,
  rsaKeys.private
);
console.log("rsa Decrypt:", rsaDecryptedMessage);
if (rsaDecryptedMessage !== message ) {
  console.error('RSA decrypt returned unexpected result')
}
```

## Forked Libraries

- [@trackforce/react-native-crypto](https://github.com/trackforce/react-native-crypto)
- [react-native-randombytes](https://github.com/mvayngrib/react-native-randombytes)

## Creating the E2E Test App

To create a test app for E2E testing of `react-native-simple-crypto`, follow these steps:

### Step 1: Create React Native Project

```bash
# Create a new React Native project
npx @react-native-community/cli@latest init CryptoTestApp --skip-install

# Navigate to the project
cd CryptoTestApp
```

### Step 2: Install Dependencies

```bash
# Install React Native dependencies
npm install

# Add your crypto library as a local dependency
npm install ../

# Install required crypto dependencies
npm install base64-js hex-lite
```

### Step 3: Configure Metro Bundler

Create `metro.config.js` in the test app root:

```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    extraNodeModules: {
      'react-native-simple-crypto': require('path').resolve(__dirname, '../'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### Step 4: Install iOS Dependencies

```bash
# Install CocoaPods dependencies
cd ios
bundle install
bundle exec pod install
cd ..
```

### Step 5: Create Test App Component

Replace `App.tsx` with the test app component (see the full component in the test-app directory).

### Step 6: Run the Test App

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Quick Setup Script

You can also use the automated setup script:

```bash
# Run the setup script
./scripts/create-test-app.sh
```

Or use this one-liner to create the test app:

```bash
# Create and setup test app
npx @react-native-community/cli@latest init CryptoTestApp --skip-install && \
cd CryptoTestApp && \
npm install && \
npm install ../ && \
npm install base64-js hex-lite && \
cd ios && bundle install && bundle exec pod install && cd .. && \
npm run ios
```

## What the Test App Includes

- ✅ **Interactive UI** with test buttons
- ✅ **Comprehensive crypto tests** for all functions
- ✅ **Real-time results** with timestamps
- ✅ **Error handling** and feedback
- ✅ **Native module integration**

## Test Functions

The app tests all major crypto functions:
- **Random Bytes** - Generate secure random data
- **SHA Hashing** - SHA-1, SHA-256, SHA-512
- **AES Encryption/Decryption** - Round-trip encryption
- **HMAC** - Message authentication
- **PBKDF2** - Password-based key derivation
- **RSA** - Key generation, encryption/decryption
- **Utility Functions** - Data conversion utilities

## Troubleshooting

**Module resolution errors:**
- Make sure `metro.config.js` is configured correctly
- Check that the library path points to the correct location
- Verify all dependencies are installed

**iOS build errors:**
- Run `cd ios && bundle exec pod install && cd ..`
- Make sure Xcode and iOS Simulator are available

**Android build errors:**
- Make sure Android SDK and emulator are set up
- Check that `android/local.properties` is configured
