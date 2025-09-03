// Mock the native modules without importing react-native
const mockNativeModules = {
  RNSCRandomBytes: {
    randomBytes: jest.fn(),
  },
  RNSCSha: {
    shaUtf8: jest.fn(),
    shaBase64: jest.fn(),
  },
  RNSCAes: {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  },
  RNSCHmac: {
    hmac256: jest.fn(),
  },
  RNSCPbkdf2: {
    hash: jest.fn(),
  },
  RNSCRsa: {
    // Add RSA methods as needed
  },
};

// Mock react-native module
jest.mock('react-native', () => ({
  NativeModules: mockNativeModules,
}));

// Global test setup
global.console = {
  ...console,
  // Uncomment to ignore console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
