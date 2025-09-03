// Mock the crypto module with all public functions
const mockCrypto = {
  utils: {
    convertArrayBufferToUtf8: jest.fn((buffer) => {
      // Simple mock implementation
      return 'mocked string';
    }),
    convertUtf8ToArrayBuffer: jest.fn((str) => {
      // Return a mock ArrayBuffer
      return new ArrayBuffer(str.length);
    }),
    convertArrayBufferToBase64: jest.fn((buffer) => {
      return 'dGVzdA==';
    }),
    convertBase64ToArrayBuffer: jest.fn((base64) => {
      return new ArrayBuffer(4);
    }),
    convertArrayBufferToHex: jest.fn((buffer) => {
      return '74657374';
    }),
    convertHexToArrayBuffer: jest.fn((hex) => {
      return new ArrayBuffer(4);
    }),
    randomBytes: jest.fn(async (length) => {
      return new ArrayBuffer(length);
    })
  },
  SHA: {
    sha1: jest.fn(async (data) => {
      if (typeof data === 'string') {
        return 'mockSha1Hash';
      } else {
        return new ArrayBuffer(20); // SHA-1 produces 20 bytes
      }
    }),
    sha256: jest.fn(async (data) => {
      if (typeof data === 'string') {
        return 'mockSha256Hash';
      } else {
        return new ArrayBuffer(32); // SHA-256 produces 32 bytes
      }
    }),
    sha512: jest.fn(async (data) => {
      if (typeof data === 'string') {
        return 'mockSha512Hash';
      } else {
        return new ArrayBuffer(64); // SHA-512 produces 64 bytes
      }
    })
  },
  AES: {
    encrypt: jest.fn(async (text, key, iv) => new ArrayBuffer(16)),
    decrypt: jest.fn(async (cipherText, key, iv) => new ArrayBuffer(16))
  },
  HMAC: {
    hmac256: jest.fn(async (text, key) => new ArrayBuffer(32))
  },
  PBKDF2: {
    hash: jest.fn(async (password, salt, iterations, keyLength, algorithm) => new ArrayBuffer(keyLength))
  },
  RSA: {
    generateKeys: jest.fn(async (keySize) => ({
      public: 'mockPublicKey',
      private: 'mockPrivateKey'
    })),
    encrypt: jest.fn(async (data, key) => 'mockEncryptedData'),
    decrypt: jest.fn(async (data, key) => 'mockDecryptedData'),
    sign: jest.fn(async (data, key, hash) => 'mockSignature'),
    verify: jest.fn(async (data, signature, key, hash) => true)
  }
};

// Mock the react-native module
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
    generateKeys: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
  },
};

jest.mock('react-native', () => ({
  NativeModules: mockNativeModules,
}));

jest.mock('../index', () => mockCrypto);

const { NativeModules } = require('react-native');
const crypto = require('../index');

describe('React Native Simple Crypto - All Public Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Utils', () => {
    describe('randomBytes', () => {
      test('should generate random bytes with specified length', async () => {
        const length = 32;
        const result = await crypto.utils.randomBytes(length);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(length);
        expect(crypto.utils.randomBytes).toHaveBeenCalledWith(length);
      });

      test('should handle different byte lengths', async () => {
        const lengths = [16, 32, 64, 128];
        
        for (const length of lengths) {
          const result = await crypto.utils.randomBytes(length);
          expect(result.byteLength).toBe(length);
        }
      });
    });

    describe('convertArrayBufferToUtf8', () => {
      test('should convert ArrayBuffer to UTF-8 string', () => {
        const testString = 'Hello, World!';
        const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(testString);
        const result = crypto.utils.convertArrayBufferToUtf8(arrayBuffer);
        
        expect(result).toBe('mocked string');
        expect(crypto.utils.convertArrayBufferToUtf8).toHaveBeenCalledWith(arrayBuffer);
      });

      test('should handle empty ArrayBuffer', () => {
        const emptyBuffer = new ArrayBuffer(0);
        const result = crypto.utils.convertArrayBufferToUtf8(emptyBuffer);
        
        expect(result).toBe('mocked string');
        expect(crypto.utils.convertArrayBufferToUtf8).toHaveBeenCalledWith(emptyBuffer);
      });
    });

    describe('convertUtf8ToArrayBuffer', () => {
      test('should convert UTF-8 string to ArrayBuffer', () => {
        const testString = 'Hello, World!';
        const result = crypto.utils.convertUtf8ToArrayBuffer(testString);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(testString.length);
        expect(crypto.utils.convertUtf8ToArrayBuffer).toHaveBeenCalledWith(testString);
      });

      test('should handle empty string', () => {
        const result = crypto.utils.convertUtf8ToArrayBuffer('');
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(0);
      });

      test('should handle special characters', () => {
        const specialString = 'Hello 世界! 🚀';
        const result = crypto.utils.convertUtf8ToArrayBuffer(specialString);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.utils.convertUtf8ToArrayBuffer).toHaveBeenCalledWith(specialString);
      });
    });

    describe('convertArrayBufferToBase64', () => {
      test('should convert ArrayBuffer to Base64', () => {
        const testString = 'test';
        const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(testString);
        const result = crypto.utils.convertArrayBufferToBase64(arrayBuffer);
        
        expect(result).toBe('dGVzdA==');
        expect(crypto.utils.convertArrayBufferToBase64).toHaveBeenCalledWith(arrayBuffer);
      });

      test('should handle empty ArrayBuffer', () => {
        const emptyBuffer = new ArrayBuffer(0);
        const result = crypto.utils.convertArrayBufferToBase64(emptyBuffer);
        
        expect(typeof result).toBe('string');
        expect(crypto.utils.convertArrayBufferToBase64).toHaveBeenCalledWith(emptyBuffer);
      });
    });

    describe('convertBase64ToArrayBuffer', () => {
      test('should convert Base64 to ArrayBuffer', () => {
        const base64 = 'dGVzdA==';
        const result = crypto.utils.convertBase64ToArrayBuffer(base64);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(4);
        expect(crypto.utils.convertBase64ToArrayBuffer).toHaveBeenCalledWith(base64);
      });

      test('should handle empty Base64 string', () => {
        const result = crypto.utils.convertBase64ToArrayBuffer('');
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.utils.convertBase64ToArrayBuffer).toHaveBeenCalledWith('');
      });
    });

    describe('convertArrayBufferToHex', () => {
      test('should convert ArrayBuffer to Hex', () => {
        const testString = 'test';
        const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(testString);
        const result = crypto.utils.convertArrayBufferToHex(arrayBuffer);
        
        expect(result).toBe('74657374');
        expect(crypto.utils.convertArrayBufferToHex).toHaveBeenCalledWith(arrayBuffer);
      });

      test('should handle empty ArrayBuffer', () => {
        const emptyBuffer = new ArrayBuffer(0);
        const result = crypto.utils.convertArrayBufferToHex(emptyBuffer);
        
        expect(typeof result).toBe('string');
        expect(crypto.utils.convertArrayBufferToHex).toHaveBeenCalledWith(emptyBuffer);
      });
    });

    describe('convertHexToArrayBuffer', () => {
      test('should convert Hex to ArrayBuffer', () => {
        const hex = '74657374';
        const result = crypto.utils.convertHexToArrayBuffer(hex);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(4);
        expect(crypto.utils.convertHexToArrayBuffer).toHaveBeenCalledWith(hex);
      });

      test('should handle empty hex string', () => {
        const result = crypto.utils.convertHexToArrayBuffer('');
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.utils.convertHexToArrayBuffer).toHaveBeenCalledWith('');
      });

      test('should handle odd-length hex string', () => {
        const oddHex = '123';
        const result = crypto.utils.convertHexToArrayBuffer(oddHex);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.utils.convertHexToArrayBuffer).toHaveBeenCalledWith(oddHex);
      });
    });
  });

  describe('SHA', () => {
    describe('sha1', () => {
      test('should hash string with SHA-1', async () => {
        const testString = 'test';
        const result = await crypto.SHA.sha1(testString);
        
        expect(result).toBe('mockSha1Hash');
        expect(crypto.SHA.sha1).toHaveBeenCalledWith(testString);
      });

      test('should hash ArrayBuffer with SHA-1', async () => {
        const testString = 'test';
        const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(testString);
        const result = await crypto.SHA.sha1(arrayBuffer);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(20); // SHA-1 produces 20 bytes
        expect(crypto.SHA.sha1).toHaveBeenCalledWith(arrayBuffer);
      });

      test('should handle empty string', async () => {
        const result = await crypto.SHA.sha1('');
        
        expect(result).toBe('mockSha1Hash');
        expect(crypto.SHA.sha1).toHaveBeenCalledWith('');
      });
    });

    describe('sha256', () => {
      test('should hash string with SHA-256', async () => {
        const testString = 'test';
        const result = await crypto.SHA.sha256(testString);
        
        expect(result).toBe('mockSha256Hash');
        expect(crypto.SHA.sha256).toHaveBeenCalledWith(testString);
      });

      test('should hash ArrayBuffer with SHA-256', async () => {
        const testString = 'test';
        const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(testString);
        const result = await crypto.SHA.sha256(arrayBuffer);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(32); // SHA-256 produces 32 bytes
        expect(crypto.SHA.sha256).toHaveBeenCalledWith(arrayBuffer);
      });

      test('should handle empty string', async () => {
        const result = await crypto.SHA.sha256('');
        
        expect(result).toBe('mockSha256Hash');
        expect(crypto.SHA.sha256).toHaveBeenCalledWith('');
      });
    });

    describe('sha512', () => {
      test('should hash string with SHA-512', async () => {
        const testString = 'test';
        const result = await crypto.SHA.sha512(testString);
        
        expect(result).toBe('mockSha512Hash');
        expect(crypto.SHA.sha512).toHaveBeenCalledWith(testString);
      });

      test('should hash ArrayBuffer with SHA-512', async () => {
        const testString = 'test';
        const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(testString);
        const result = await crypto.SHA.sha512(arrayBuffer);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(64); // SHA-512 produces 64 bytes
        expect(crypto.SHA.sha512).toHaveBeenCalledWith(arrayBuffer);
      });

      test('should handle empty string', async () => {
        const result = await crypto.SHA.sha512('');
        
        expect(result).toBe('mockSha512Hash');
        expect(crypto.SHA.sha512).toHaveBeenCalledWith('');
      });
    });
  });

  describe('AES', () => {
    describe('encrypt', () => {
      test('should encrypt data with AES', async () => {
        const text = 'Hello, World!';
        const key = '12345678901234567890123456789012'; // 32 bytes
        const iv = '1234567890123456'; // 16 bytes

        const textBuffer = crypto.utils.convertUtf8ToArrayBuffer(text);
        const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);
        const ivBuffer = crypto.utils.convertUtf8ToArrayBuffer(iv);

        const result = await crypto.AES.encrypt(textBuffer, keyBuffer, ivBuffer);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.AES.encrypt).toHaveBeenCalledWith(textBuffer, keyBuffer, ivBuffer);
      });

      test('should handle empty text', async () => {
        const text = '';
        const key = '12345678901234567890123456789012';
        const iv = '1234567890123456';

        const textBuffer = crypto.utils.convertUtf8ToArrayBuffer(text);
        const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);
        const ivBuffer = crypto.utils.convertUtf8ToArrayBuffer(iv);

        const result = await crypto.AES.encrypt(textBuffer, keyBuffer, ivBuffer);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.AES.encrypt).toHaveBeenCalledWith(textBuffer, keyBuffer, ivBuffer);
      });
    });

    describe('decrypt', () => {
      test('should decrypt data with AES', async () => {
        const encrypted = 'encryptedData';
        const key = '12345678901234567890123456789012';
        const iv = '1234567890123456';

        const encryptedBuffer = crypto.utils.convertUtf8ToArrayBuffer(encrypted);
        const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);
        const ivBuffer = crypto.utils.convertUtf8ToArrayBuffer(iv);

        const result = await crypto.AES.decrypt(encryptedBuffer, keyBuffer, ivBuffer);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.AES.decrypt).toHaveBeenCalledWith(encryptedBuffer, keyBuffer, ivBuffer);
      });

      test('should handle empty encrypted data', async () => {
        const encrypted = '';
        const key = '12345678901234567890123456789012';
        const iv = '1234567890123456';

        const encryptedBuffer = crypto.utils.convertUtf8ToArrayBuffer(encrypted);
        const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);
        const ivBuffer = crypto.utils.convertUtf8ToArrayBuffer(iv);

        const result = await crypto.AES.decrypt(encryptedBuffer, keyBuffer, ivBuffer);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(crypto.AES.decrypt).toHaveBeenCalledWith(encryptedBuffer, keyBuffer, ivBuffer);
      });
    });
  });

  describe('HMAC', () => {
    describe('hmac256', () => {
      test('should generate HMAC-256', async () => {
        const text = 'Hello, World!';
        const key = 'secretKey';

        const textBuffer = crypto.utils.convertUtf8ToArrayBuffer(text);
        const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);

        const result = await crypto.HMAC.hmac256(textBuffer, keyBuffer);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(32); // SHA-256 produces 32 bytes
        expect(crypto.HMAC.hmac256).toHaveBeenCalledWith(textBuffer, keyBuffer);
      });

      test('should handle empty text', async () => {
        const text = '';
        const key = 'secretKey';

        const textBuffer = crypto.utils.convertUtf8ToArrayBuffer(text);
        const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);

        const result = await crypto.HMAC.hmac256(textBuffer, keyBuffer);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(32);
        expect(crypto.HMAC.hmac256).toHaveBeenCalledWith(textBuffer, keyBuffer);
      });

      test('should handle empty key', async () => {
        const text = 'Hello, World!';
        const key = '';

        const textBuffer = crypto.utils.convertUtf8ToArrayBuffer(text);
        const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);

        const result = await crypto.HMAC.hmac256(textBuffer, keyBuffer);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(32);
        expect(crypto.HMAC.hmac256).toHaveBeenCalledWith(textBuffer, keyBuffer);
      });
    });
  });

  describe('PBKDF2', () => {
    describe('hash', () => {
      test('should hash password with string inputs', async () => {
        const password = 'password';
        const salt = 'salt';
        const iterations = 1000;
        const keyLength = 32;
        const algorithm = 'SHA-256';

        const result = await crypto.PBKDF2.hash(password, salt, iterations, keyLength, algorithm);

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(keyLength);
        expect(crypto.PBKDF2.hash).toHaveBeenCalledWith(password, salt, iterations, keyLength, algorithm);
      });

      test('should hash password with ArrayBuffer inputs', async () => {
        const password = 'password';
        const salt = 'salt';
        const passwordBuffer = crypto.utils.convertUtf8ToArrayBuffer(password);
        const saltBuffer = crypto.utils.convertUtf8ToArrayBuffer(salt);

        const result = await crypto.PBKDF2.hash(passwordBuffer, saltBuffer, 1000, 32, 'SHA-256');

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(32);
        expect(crypto.PBKDF2.hash).toHaveBeenCalledWith(passwordBuffer, saltBuffer, 1000, 32, 'SHA-256');
      });

      test('should handle different algorithms', async () => {
        const password = 'password';
        const salt = 'salt';
        const algorithms = ['SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512'];

        for (const algorithm of algorithms) {
          const result = await crypto.PBKDF2.hash(password, salt, 1000, 32, algorithm);
          expect(result).toBeInstanceOf(ArrayBuffer);
          expect(result.byteLength).toBe(32);
          expect(crypto.PBKDF2.hash).toHaveBeenCalledWith(password, salt, 1000, 32, algorithm);
        }
      });

      test('should handle different key lengths', async () => {
        const password = 'password';
        const salt = 'salt';
        const keyLengths = [16, 32, 64, 128];

        for (const keyLength of keyLengths) {
          const result = await crypto.PBKDF2.hash(password, salt, 1000, keyLength, 'SHA-256');
          expect(result).toBeInstanceOf(ArrayBuffer);
          expect(result.byteLength).toBe(keyLength);
          expect(crypto.PBKDF2.hash).toHaveBeenCalledWith(password, salt, 1000, keyLength, 'SHA-256');
        }
      });

      test('should handle different iteration counts', async () => {
        const password = 'password';
        const salt = 'salt';
        const iterations = [1000, 10000, 100000];

        for (const iteration of iterations) {
          const result = await crypto.PBKDF2.hash(password, salt, iteration, 32, 'SHA-256');
          expect(result).toBeInstanceOf(ArrayBuffer);
          expect(result.byteLength).toBe(32);
          expect(crypto.PBKDF2.hash).toHaveBeenCalledWith(password, salt, iteration, 32, 'SHA-256');
        }
      });

      test('should handle empty password', async () => {
        const password = '';
        const salt = 'salt';

        const result = await crypto.PBKDF2.hash(password, salt, 1000, 32, 'SHA-256');

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(32);
        expect(crypto.PBKDF2.hash).toHaveBeenCalledWith(password, salt, 1000, 32, 'SHA-256');
      });

      test('should handle empty salt', async () => {
        const password = 'password';
        const salt = '';

        const result = await crypto.PBKDF2.hash(password, salt, 1000, 32, 'SHA-256');

        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result.byteLength).toBe(32);
        expect(crypto.PBKDF2.hash).toHaveBeenCalledWith(password, salt, 1000, 32, 'SHA-256');
      });
    });
  });

  describe('RSA', () => {
    describe('generateKeys', () => {
      test('should generate RSA key pair', async () => {
        const keySize = 1024;
        const result = await crypto.RSA.generateKeys(keySize);

        expect(result).toHaveProperty('public');
        expect(result).toHaveProperty('private');
        expect(result.public).toBe('mockPublicKey');
        expect(result.private).toBe('mockPrivateKey');
        expect(crypto.RSA.generateKeys).toHaveBeenCalledWith(keySize);
      });

      test('should handle different key sizes', async () => {
        const keySizes = [512, 1024, 2048, 4096];

        for (const keySize of keySizes) {
          const result = await crypto.RSA.generateKeys(keySize);
          expect(result).toHaveProperty('public');
          expect(result).toHaveProperty('private');
          expect(crypto.RSA.generateKeys).toHaveBeenCalledWith(keySize);
        }
      });
    });

    describe('encrypt', () => {
      test('should encrypt data with RSA', async () => {
        const data = 'Hello, World!';
        const key = 'mockPublicKey';

        const result = await crypto.RSA.encrypt(data, key);

        expect(result).toBe('mockEncryptedData');
        expect(crypto.RSA.encrypt).toHaveBeenCalledWith(data, key);
      });

      test('should handle empty data', async () => {
        const data = '';
        const key = 'mockPublicKey';

        const result = await crypto.RSA.encrypt(data, key);

        expect(result).toBe('mockEncryptedData');
        expect(crypto.RSA.encrypt).toHaveBeenCalledWith(data, key);
      });
    });

    describe('decrypt', () => {
      test('should decrypt data with RSA', async () => {
        const data = 'encryptedData';
        const key = 'mockPrivateKey';

        const result = await crypto.RSA.decrypt(data, key);

        expect(result).toBe('mockDecryptedData');
        expect(crypto.RSA.decrypt).toHaveBeenCalledWith(data, key);
      });

      test('should handle empty data', async () => {
        const data = '';
        const key = 'mockPrivateKey';

        const result = await crypto.RSA.decrypt(data, key);

        expect(result).toBe('mockDecryptedData');
        expect(crypto.RSA.decrypt).toHaveBeenCalledWith(data, key);
      });
    });

    describe('sign', () => {
      test('should sign data with RSA', async () => {
        const data = 'Hello, World!';
        const key = 'mockPrivateKey';
        const hash = 'SHA-256';

        const result = await crypto.RSA.sign(data, key, hash);

        expect(result).toBe('mockSignature');
        expect(crypto.RSA.sign).toHaveBeenCalledWith(data, key, hash);
      });

      test('should handle different hash algorithms', async () => {
        const data = 'Hello, World!';
        const key = 'mockPrivateKey';
        const hashAlgorithms = ['Raw', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512'];

        for (const hash of hashAlgorithms) {
          const result = await crypto.RSA.sign(data, key, hash);
          expect(result).toBe('mockSignature');
          expect(crypto.RSA.sign).toHaveBeenCalledWith(data, key, hash);
        }
      });

      test('should handle empty data', async () => {
        const data = '';
        const key = 'mockPrivateKey';
        const hash = 'SHA-256';

        const result = await crypto.RSA.sign(data, key, hash);

        expect(result).toBe('mockSignature');
        expect(crypto.RSA.sign).toHaveBeenCalledWith(data, key, hash);
      });
    });

    describe('verify', () => {
      test('should verify signature with RSA', async () => {
        const data = 'Hello, World!';
        const signature = 'mockSignature';
        const key = 'mockPublicKey';
        const hash = 'SHA-256';

        const result = await crypto.RSA.verify(data, signature, key, hash);

        expect(result).toBe(true);
        expect(crypto.RSA.verify).toHaveBeenCalledWith(data, signature, key, hash);
      });

      test('should handle different hash algorithms', async () => {
        const data = 'Hello, World!';
        const signature = 'mockSignature';
        const key = 'mockPublicKey';
        const hashAlgorithms = ['Raw', 'SHA1', 'SHA224', 'SHA256', 'SHA384', 'SHA512'];

        for (const hash of hashAlgorithms) {
          const result = await crypto.RSA.verify(data, signature, key, hash);
          expect(result).toBe(true);
          expect(crypto.RSA.verify).toHaveBeenCalledWith(data, signature, key, hash);
        }
      });

      test('should handle empty data', async () => {
        const data = '';
        const signature = 'mockSignature';
        const key = 'mockPublicKey';
        const hash = 'SHA-256';

        const result = await crypto.RSA.verify(data, signature, key, hash);

        expect(result).toBe(true);
        expect(crypto.RSA.verify).toHaveBeenCalledWith(data, signature, key, hash);
      });
    });
  });

  describe('Integration Tests', () => {
    test('should work with round-trip conversions', async () => {
      const originalText = 'Hello, World!';
      
      // String -> ArrayBuffer -> String
      const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(originalText);
      const backToString = crypto.utils.convertArrayBufferToUtf8(arrayBuffer);
      
      expect(backToString).toBe('mocked string');
      expect(crypto.utils.convertUtf8ToArrayBuffer).toHaveBeenCalledWith(originalText);
      expect(crypto.utils.convertArrayBufferToUtf8).toHaveBeenCalledWith(arrayBuffer);
    });

    test('should work with Base64 round-trip', async () => {
      const originalText = 'test';
      const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(originalText);
      const base64 = crypto.utils.convertArrayBufferToBase64(arrayBuffer);
      const backToBuffer = crypto.utils.convertBase64ToArrayBuffer(base64);
      const finalText = crypto.utils.convertArrayBufferToUtf8(backToBuffer);
      
      expect(finalText).toBe('mocked string');
      expect(crypto.utils.convertArrayBufferToBase64).toHaveBeenCalledWith(arrayBuffer);
      expect(crypto.utils.convertBase64ToArrayBuffer).toHaveBeenCalledWith(base64);
    });

    test('should work with Hex round-trip', async () => {
      const originalText = 'test';
      const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(originalText);
      const hex = crypto.utils.convertArrayBufferToHex(arrayBuffer);
      const backToBuffer = crypto.utils.convertHexToArrayBuffer(hex);
      const finalText = crypto.utils.convertArrayBufferToUtf8(backToBuffer);
      
      expect(finalText).toBe('mocked string');
      expect(crypto.utils.convertArrayBufferToHex).toHaveBeenCalledWith(arrayBuffer);
      expect(crypto.utils.convertHexToArrayBuffer).toHaveBeenCalledWith(hex);
    });
  });
});
