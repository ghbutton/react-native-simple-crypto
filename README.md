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
```

For React Native 0.60+, autolinking handles native setup automatically. For iOS, run `cd ios && pod install`.

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

## Example

```javascript
import RNSimpleCrypto from "react-native-simple-crypto";

// -- AES ------------------------------------------------------------- //
const message = "data to encrypt";
const messageBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(message);
const key = await RNSimpleCrypto.utils.randomBytes(16);
const iv = await RNSimpleCrypto.utils.randomBytes(16);

const cipherText = await RNSimpleCrypto.AES.encrypt(messageBuffer, key, iv);
const decrypted = await RNSimpleCrypto.AES.decrypt(cipherText, key, iv);
console.log(RNSimpleCrypto.utils.convertArrayBufferToUtf8(decrypted)); // "data to encrypt"

// -- SHA ------------------------------------------------------------- //
const sha256 = await RNSimpleCrypto.SHA.sha256("test");

// -- HMAC ------------------------------------------------------------ //
const hmacKey = await RNSimpleCrypto.utils.randomBytes(32);
const signature = await RNSimpleCrypto.HMAC.hmac256(messageBuffer, hmacKey);

// -- PBKDF2 ---------------------------------------------------------- //
const derivedKey = await RNSimpleCrypto.PBKDF2.hash("password", "salt", 4096, 32, "SHA1");

// -- RSA ------------------------------------------------------------- //
const rsaKeys = await RNSimpleCrypto.RSA.generateKeys(2048);
const encrypted = await RNSimpleCrypto.RSA.encrypt(message, rsaKeys.public);
const decryptedRsa = await RNSimpleCrypto.RSA.decrypt(encrypted, rsaKeys.private);

const sig = await RNSimpleCrypto.RSA.sign(message, rsaKeys.private, "SHA256");
const valid = await RNSimpleCrypto.RSA.verify(sig, message, rsaKeys.public, "SHA256");
```

## Running E2E Tests

The test suite uses a React Native example app with [Maestro](https://maestro.mobile.dev/) for E2E testing. Tests cover AES, SHA, HMAC, PBKDF2, RSA, and utility functions (22+ assertions).

### Prerequisites

- Xcode with iOS Simulator
- [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro)

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Setup

```bash
# Install library dependencies (needed for hex-lite and base64-js)
npm install

# Install example app dependencies
cd example
npm install
cd ios && bundle exec pod install && cd ..
```

### Run

```bash
# Terminal 1: Start Metro
cd example
npx react-native start --reset-cache

# Terminal 2: Build and run the app on simulator
cd example
npx react-native run-ios --simulator="iPhone 16 Pro"

# Terminal 3: Run Maestro tests (once the app is loaded)
maestro test maestro/flows/run_all_tests.yaml
```

You can also run individual test modules:

```bash
maestro test maestro/flows/aes_tests.yaml
maestro test maestro/flows/sha_tests.yaml
maestro test maestro/flows/hmac_tests.yaml
maestro test maestro/flows/pbkdf2_tests.yaml
maestro test maestro/flows/rsa_tests.yaml
maestro test maestro/flows/utils_tests.yaml
```

## Forked Libraries

- [@trackforce/react-native-crypto](https://github.com/trackforce/react-native-crypto)
- [react-native-randombytes](https://github.com/mvayngrib/react-native-randombytes)
