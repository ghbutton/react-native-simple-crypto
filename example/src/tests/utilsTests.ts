import RNSimpleCrypto from 'react-native-simple-crypto';
import {TestResult} from './types';

export async function runUtilsTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test 1: randomBytes returns correct length
  try {
    const bytes16 = await RNSimpleCrypto.utils.randomBytes(16);
    const hex16 = RNSimpleCrypto.utils.convertArrayBufferToHex(bytes16);
    results.push({
      name: 'random-bytes-length',
      status: hex16.length === 32 ? 'pass' : 'fail',
      detail: `randomBytes(16) = ${hex16.length} hex chars`,
    });
  } catch (e: any) {
    results.push({
      name: 'random-bytes-length',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 2: randomBytes produces different output each call
  try {
    const bytes1 = await RNSimpleCrypto.utils.randomBytes(16);
    const bytes2 = await RNSimpleCrypto.utils.randomBytes(16);
    const hex1 = RNSimpleCrypto.utils.convertArrayBufferToHex(bytes1);
    const hex2 = RNSimpleCrypto.utils.convertArrayBufferToHex(bytes2);
    results.push({
      name: 'random-bytes-unique',
      status: hex1 !== hex2 ? 'pass' : 'fail',
      detail:
        hex1 !== hex2 ? 'Two calls produced different bytes' : 'Collision',
    });
  } catch (e: any) {
    results.push({
      name: 'random-bytes-unique',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 3: UTF8 round-trip
  try {
    const original = 'Hello, World!';
    const buf = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(original);
    const restored = RNSimpleCrypto.utils.convertArrayBufferToUtf8(buf);
    results.push({
      name: 'utf8-roundtrip',
      status: restored === original ? 'pass' : 'fail',
      detail:
        restored === original
          ? 'UTF8 round-trip matched'
          : `Mismatch: "${restored}"`,
    });
  } catch (e: any) {
    results.push({
      name: 'utf8-roundtrip',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 4: Base64 round-trip
  try {
    const original = 'Base64 test data';
    const buf = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(original);
    const base64 = RNSimpleCrypto.utils.convertArrayBufferToBase64(buf);
    const fromBase64 = RNSimpleCrypto.utils.convertBase64ToArrayBuffer(base64);
    const restored =
      RNSimpleCrypto.utils.convertArrayBufferToUtf8(fromBase64);
    results.push({
      name: 'base64-roundtrip',
      status: restored === original ? 'pass' : 'fail',
      detail:
        restored === original ? 'Base64 round-trip matched' : 'Mismatch',
    });
  } catch (e: any) {
    results.push({
      name: 'base64-roundtrip',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 5: convertHexToArrayBuffer rejects odd-length hex
  try {
    let threw = false;
    try {
      RNSimpleCrypto.utils.convertHexToArrayBuffer('abc'); // 3 chars = invalid
    } catch {
      threw = true;
    }
    results.push({
      name: 'hex-invalid-odd',
      status: threw ? 'pass' : 'fail',
      detail: threw
        ? 'Odd-length hex correctly rejected'
        : 'Odd-length hex did not throw',
    });
  } catch (e: any) {
    results.push({
      name: 'hex-invalid-odd',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 6: Hex round-trip
  try {
    const original = 'Hex test data';
    const buf = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(original);
    const hex = RNSimpleCrypto.utils.convertArrayBufferToHex(buf);
    const fromHex = RNSimpleCrypto.utils.convertHexToArrayBuffer(hex);
    const restored = RNSimpleCrypto.utils.convertArrayBufferToUtf8(fromHex);
    results.push({
      name: 'hex-roundtrip',
      status: restored === original ? 'pass' : 'fail',
      detail: restored === original ? 'Hex round-trip matched' : 'Mismatch',
    });
  } catch (e: any) {
    results.push({
      name: 'hex-roundtrip',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  return results;
}
