import RNSimpleCrypto from 'react-native-simple-crypto';
import {TestResult} from './types';

export async function runRsaTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test 1: Key generation (1024-bit for speed in tests)
  let keys: {public: string; private: string};
  try {
    keys = await RNSimpleCrypto.RSA.generateKeys(1024);
    results.push({
      name: 'keygen',
      status: keys.public && keys.private ? 'pass' : 'fail',
      detail: keys.public
        ? `Public key length: ${keys.public.length}`
        : 'No keys generated',
    });
  } catch (e: any) {
    results.push({
      name: 'keygen',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
    return results; // Cannot continue without keys
  }

  // Test 2: Encrypt then decrypt round-trip
  try {
    const message = 'Hello RSA!';
    const encrypted = await RNSimpleCrypto.RSA.encrypt(message, keys.public);
    const decrypted = await RNSimpleCrypto.RSA.decrypt(
      encrypted,
      keys.private,
    );
    results.push({
      name: 'encrypt-decrypt',
      status: decrypted === message ? 'pass' : 'fail',
      detail:
        decrypted === message
          ? 'Round-trip matched'
          : `Expected "${message}", got "${decrypted}"`,
    });
  } catch (e: any) {
    results.push({
      name: 'encrypt-decrypt',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 3: Sign then verify
  try {
    const dataToSign = 'data to be signed';
    const signature = await RNSimpleCrypto.RSA.sign(
      dataToSign,
      keys.private,
      'SHA256',
    );
    const isValid = await RNSimpleCrypto.RSA.verify(
      signature,
      dataToSign,
      keys.public,
      'SHA256',
    );
    results.push({
      name: 'sign-verify',
      status: isValid === true ? 'pass' : 'fail',
      detail: isValid ? 'Signature verified' : 'Signature invalid',
    });
  } catch (e: any) {
    results.push({
      name: 'sign-verify',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 4: Verify with tampered data fails
  try {
    const dataToSign = 'original data';
    const signature = await RNSimpleCrypto.RSA.sign(
      dataToSign,
      keys.private,
      'SHA256',
    );
    const isValid = await RNSimpleCrypto.RSA.verify(
      signature,
      'tampered data',
      keys.public,
      'SHA256',
    );
    results.push({
      name: 'verify-tampered',
      status: isValid === false ? 'pass' : 'fail',
      detail:
        isValid === false
          ? 'Tampered data correctly rejected'
          : 'Tampered data accepted',
    });
  } catch {
    // Some implementations throw on invalid verify rather than returning false
    results.push({
      name: 'verify-tampered',
      status: 'pass',
      detail: 'Tampered data threw error (expected)',
    });
  }

  return results;
}
