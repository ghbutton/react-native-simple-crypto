import { device, element, by, expect } from 'detox';
import crypto from '../index';

describe('React Native Simple Crypto E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Crypto Operations', () => {
    it('should perform SHA-256 hashing', async () => {
      const testString = 'Hello, World!';
      const hash = await crypto.SHA.sha256(testString);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    it('should perform AES encryption and decryption', async () => {
      const text = 'Secret message';
      const key = '12345678901234567890123456789012'; // 32 bytes
      const iv = '1234567890123456'; // 16 bytes

      const textBuffer = crypto.utils.convertUtf8ToArrayBuffer(text);
      const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);
      const ivBuffer = crypto.utils.convertUtf8ToArrayBuffer(iv);

      // Encrypt
      const encrypted = await crypto.AES.encrypt(textBuffer, keyBuffer, ivBuffer);
      expect(encrypted).toBeInstanceOf(ArrayBuffer);

      // Decrypt
      const decrypted = await crypto.AES.decrypt(encrypted, keyBuffer, ivBuffer);
      const decryptedText = crypto.utils.convertArrayBufferToUtf8(decrypted);

      expect(decryptedText).toBe(text);
    });

    it('should generate random bytes', async () => {
      const length = 32;
      const randomBytes = await crypto.utils.randomBytes(length);

      expect(randomBytes).toBeInstanceOf(ArrayBuffer);
      expect(randomBytes.byteLength).toBe(length);
    });

    it('should perform HMAC-256', async () => {
      const text = 'Message to sign';
      const key = 'secretKey';

      const textBuffer = crypto.utils.convertUtf8ToArrayBuffer(text);
      const keyBuffer = crypto.utils.convertUtf8ToArrayBuffer(key);

      const hmac = await crypto.HMAC.hmac256(textBuffer, keyBuffer);

      expect(hmac).toBeInstanceOf(ArrayBuffer);
      expect(hmac.byteLength).toBe(32); // SHA-256 produces 32 bytes
    });

    it('should perform PBKDF2 hashing', async () => {
      const password = 'myPassword';
      const salt = 'randomSalt';
      const iterations = 1000;
      const keyLength = 32;
      const algorithm = 'SHA-256';

      const hash = await crypto.PBKDF2.hash(password, salt, iterations, keyLength, algorithm);

      expect(hash).toBeInstanceOf(ArrayBuffer);
      expect(hash.byteLength).toBe(keyLength);
    });
  });

  describe('Utility Functions', () => {
    it('should convert between different formats', async () => {
      const originalText = 'Test string';

      // String to ArrayBuffer
      const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(originalText);
      expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);

      // ArrayBuffer to Base64
      const base64 = crypto.utils.convertArrayBufferToBase64(arrayBuffer);
      expect(typeof base64).toBe('string');

      // Base64 to ArrayBuffer
      const backToBuffer = crypto.utils.convertBase64ToArrayBuffer(base64);
      expect(backToBuffer).toBeInstanceOf(ArrayBuffer);

      // ArrayBuffer to String
      const finalText = crypto.utils.convertArrayBufferToUtf8(backToBuffer);
      expect(finalText).toBe(originalText);
    });

    it('should convert between hex and ArrayBuffer', async () => {
      const originalText = 'Hello';
      const arrayBuffer = crypto.utils.convertUtf8ToArrayBuffer(originalText);

      // ArrayBuffer to Hex
      const hex = crypto.utils.convertArrayBufferToHex(arrayBuffer);
      expect(typeof hex).toBe('string');

      // Hex to ArrayBuffer
      const backToBuffer = crypto.utils.convertHexToArrayBuffer(hex);
      expect(backToBuffer).toBeInstanceOf(ArrayBuffer);

      // Verify round trip
      const finalText = crypto.utils.convertArrayBufferToUtf8(backToBuffer);
      expect(finalText).toBe(originalText);
    });
  });
});
