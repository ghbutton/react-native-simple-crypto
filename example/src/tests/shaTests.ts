import RNSimpleCrypto from 'react-native-simple-crypto';
import {TestResult} from './types';

export async function runShaTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test SHA1 with string input
  try {
    const sha1 = await RNSimpleCrypto.SHA.sha1('test');
    const expected = 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3';
    results.push({
      name: 'sha1-known',
      status: sha1 === expected ? 'pass' : 'fail',
      detail: `SHA1("test") = ${sha1}`,
    });
  } catch (e: any) {
    results.push({
      name: 'sha1-known',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test SHA256 with string input
  try {
    const sha256 = await RNSimpleCrypto.SHA.sha256('test');
    const expected =
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    results.push({
      name: 'sha256-known',
      status: sha256 === expected ? 'pass' : 'fail',
      detail: `SHA256("test") = ${sha256}`,
    });
  } catch (e: any) {
    results.push({
      name: 'sha256-known',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test SHA512 with string input
  try {
    const sha512 = await RNSimpleCrypto.SHA.sha512('test');
    const expected =
      'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff';
    results.push({
      name: 'sha512-known',
      status: sha512 === expected ? 'pass' : 'fail',
      detail: `SHA512("test") = ${sha512.substring(0, 32)}...`,
    });
  } catch (e: any) {
    results.push({
      name: 'sha512-known',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test SHA256 with ArrayBuffer input matches string input
  try {
    const sha256String = await RNSimpleCrypto.SHA.sha256('test');
    const buf = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer('test');
    const sha256Buf = await RNSimpleCrypto.SHA.sha256(buf);
    const sha256Hex = RNSimpleCrypto.utils.convertArrayBufferToHex(
      sha256Buf as ArrayBuffer,
    );
    results.push({
      name: 'sha256-arraybuffer',
      status: sha256Hex === sha256String ? 'pass' : 'fail',
      detail:
        sha256Hex === sha256String
          ? 'ArrayBuffer and string inputs match'
          : `Mismatch: ${sha256Hex} vs ${sha256String}`,
    });
  } catch (e: any) {
    results.push({
      name: 'sha256-arraybuffer',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 5: Invalid algorithm should throw (not crash)
  try {
    let threw = false;
    try {
      const {NativeModules} = require('react-native');
      await NativeModules.RNSCSha.shaUtf8('test', 'INVALID-ALG');
    } catch {
      threw = true;
    }
    results.push({
      name: 'sha-invalid-algorithm',
      status: threw ? 'pass' : 'fail',
      detail: threw
        ? 'Invalid algorithm correctly rejected'
        : 'Invalid algorithm did not throw',
    });
  } catch (e: any) {
    results.push({
      name: 'sha-invalid-algorithm',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  return results;
}
