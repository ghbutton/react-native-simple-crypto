import RNSimpleCrypto from 'react-native-simple-crypto';
import {TestResult} from './types';

export async function runAesTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test 1: AES encrypt then decrypt round-trip
  try {
    const message = 'Hello, AES encryption test!';
    const messageBuffer =
      RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(message);
    const key = await RNSimpleCrypto.utils.randomBytes(16); // 128-bit key
    const iv = await RNSimpleCrypto.utils.randomBytes(16); // 128-bit IV
    const cipherText = await RNSimpleCrypto.AES.encrypt(
      messageBuffer,
      key,
      iv,
    );
    const decrypted = await RNSimpleCrypto.AES.decrypt(cipherText, key, iv);
    const decryptedText =
      RNSimpleCrypto.utils.convertArrayBufferToUtf8(decrypted);

    results.push({
      name: 'roundtrip',
      status: decryptedText === message ? 'pass' : 'fail',
      detail:
        decryptedText === message
          ? 'Round-trip matched'
          : `Expected "${message}", got "${decryptedText}"`,
    });
  } catch (e: any) {
    results.push({
      name: 'roundtrip',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 2: Different key fails to decrypt
  try {
    const message = 'key mismatch test';
    const messageBuffer =
      RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(message);
    const key1 = await RNSimpleCrypto.utils.randomBytes(16);
    const key2 = await RNSimpleCrypto.utils.randomBytes(16);
    const iv = await RNSimpleCrypto.utils.randomBytes(16);
    const cipherText = await RNSimpleCrypto.AES.encrypt(
      messageBuffer,
      key1,
      iv,
    );
    let wrongDecrypt = false;
    try {
      const bad = await RNSimpleCrypto.AES.decrypt(cipherText, key2, iv);
      const badText = RNSimpleCrypto.utils.convertArrayBufferToUtf8(bad);
      wrongDecrypt = badText !== message;
    } catch {
      wrongDecrypt = true;
    }
    results.push({
      name: 'wrong-key',
      status: wrongDecrypt ? 'pass' : 'fail',
      detail: wrongDecrypt
        ? 'Wrong key correctly failed'
        : 'Wrong key unexpectedly succeeded',
    });
  } catch (e: any) {
    results.push({
      name: 'wrong-key',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  return results;
}
