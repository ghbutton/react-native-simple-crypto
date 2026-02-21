import RNSimpleCrypto from 'react-native-simple-crypto';
import {TestResult} from './types';

export async function runPbkdf2Tests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test 1: Output has correct length (32 bytes = 64 hex chars)
  try {
    const key = await RNSimpleCrypto.PBKDF2.hash(
      'password',
      'salt',
      4096,
      32,
      'SHA1',
    );
    const keyHex = RNSimpleCrypto.utils.convertArrayBufferToHex(key);
    results.push({
      name: 'pbkdf2-length',
      status: keyHex.length === 64 ? 'pass' : 'fail',
      detail: `PBKDF2 output: ${keyHex.length} hex chars`,
    });
  } catch (e: any) {
    results.push({
      name: 'pbkdf2-length',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 2: Same inputs = same output (deterministic)
  try {
    const key1 = await RNSimpleCrypto.PBKDF2.hash(
      'password',
      'salt',
      4096,
      32,
      'SHA1',
    );
    const key2 = await RNSimpleCrypto.PBKDF2.hash(
      'password',
      'salt',
      4096,
      32,
      'SHA1',
    );
    const hex1 = RNSimpleCrypto.utils.convertArrayBufferToHex(key1);
    const hex2 = RNSimpleCrypto.utils.convertArrayBufferToHex(key2);
    results.push({
      name: 'pbkdf2-deterministic',
      status: hex1 === hex2 ? 'pass' : 'fail',
      detail: hex1 === hex2 ? 'Deterministic output' : 'Non-deterministic',
    });
  } catch (e: any) {
    results.push({
      name: 'pbkdf2-deterministic',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 3: String vs ArrayBuffer inputs produce same result
  try {
    const keyFromString = await RNSimpleCrypto.PBKDF2.hash(
      'password',
      'salt',
      4096,
      32,
      'SHA1',
    );
    const passwordBuf =
      RNSimpleCrypto.utils.convertUtf8ToArrayBuffer('password');
    const saltBuf = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer('salt');
    const keyFromBuffer = await RNSimpleCrypto.PBKDF2.hash(
      passwordBuf,
      saltBuf,
      4096,
      32,
      'SHA1',
    );
    const hexString =
      RNSimpleCrypto.utils.convertArrayBufferToHex(keyFromString);
    const hexBuffer =
      RNSimpleCrypto.utils.convertArrayBufferToHex(keyFromBuffer);
    results.push({
      name: 'pbkdf2-string-vs-buffer',
      status: hexString === hexBuffer ? 'pass' : 'fail',
      detail:
        hexString === hexBuffer
          ? 'String and ArrayBuffer inputs match'
          : 'Mismatch',
    });
  } catch (e: any) {
    results.push({
      name: 'pbkdf2-string-vs-buffer',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 4: SHA256 algorithm works and differs from SHA1
  try {
    const keySha1 = await RNSimpleCrypto.PBKDF2.hash(
      'password',
      'salt',
      4096,
      32,
      'SHA1',
    );
    const keySha256 = await RNSimpleCrypto.PBKDF2.hash(
      'password',
      'salt',
      4096,
      32,
      'SHA256',
    );
    const hexSha1 = RNSimpleCrypto.utils.convertArrayBufferToHex(keySha1);
    const hexSha256 = RNSimpleCrypto.utils.convertArrayBufferToHex(keySha256);
    results.push({
      name: 'pbkdf2-sha256',
      status:
        hexSha256.length === 64 && hexSha256 !== hexSha1 ? 'pass' : 'fail',
      detail: `SHA256 PBKDF2: ${hexSha256.substring(0, 16)}...`,
    });
  } catch (e: any) {
    results.push({
      name: 'pbkdf2-sha256',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 5: Invalid algorithm should not crash
  try {
    let threw = false;
    try {
      await RNSimpleCrypto.PBKDF2.hash('password', 'salt', 4096, 32, 'INVALID');
    } catch {
      threw = true;
    }
    results.push({
      name: 'pbkdf2-invalid-algorithm',
      status: threw ? 'pass' : 'fail',
      detail: threw
        ? 'Invalid algorithm correctly rejected'
        : 'Invalid algorithm did not throw',
    });
  } catch (e: any) {
    results.push({
      name: 'pbkdf2-invalid-algorithm',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  return results;
}
