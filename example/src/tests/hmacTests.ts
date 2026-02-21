import RNSimpleCrypto from 'react-native-simple-crypto';
import {TestResult} from './types';

export async function runHmacTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  const message = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer('test message');
  const key = await RNSimpleCrypto.utils.randomBytes(32);

  // Test 1: HMAC-SHA256 produces correct length (32 bytes = 64 hex chars)
  try {
    const signature = await RNSimpleCrypto.HMAC.hmac256(message, key);
    const signatureHex =
      RNSimpleCrypto.utils.convertArrayBufferToHex(signature);
    results.push({
      name: 'hmac256-length',
      status: signatureHex.length === 64 ? 'pass' : 'fail',
      detail: `HMAC length: ${signatureHex.length} hex chars`,
    });
  } catch (e: any) {
    results.push({
      name: 'hmac256-length',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 2: Same input + same key = same output (deterministic)
  try {
    const sig1 = await RNSimpleCrypto.HMAC.hmac256(message, key);
    const sig2 = await RNSimpleCrypto.HMAC.hmac256(message, key);
    const hex1 = RNSimpleCrypto.utils.convertArrayBufferToHex(sig1);
    const hex2 = RNSimpleCrypto.utils.convertArrayBufferToHex(sig2);
    results.push({
      name: 'hmac256-deterministic',
      status: hex1 === hex2 ? 'pass' : 'fail',
      detail:
        hex1 === hex2
          ? 'Same input produces same HMAC'
          : 'Non-deterministic',
    });
  } catch (e: any) {
    results.push({
      name: 'hmac256-deterministic',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  // Test 3: Different key = different output
  try {
    const key2 = await RNSimpleCrypto.utils.randomBytes(32);
    const sig1 = await RNSimpleCrypto.HMAC.hmac256(message, key);
    const sig2 = await RNSimpleCrypto.HMAC.hmac256(message, key2);
    const hex1 = RNSimpleCrypto.utils.convertArrayBufferToHex(sig1);
    const hex2 = RNSimpleCrypto.utils.convertArrayBufferToHex(sig2);
    results.push({
      name: 'hmac256-different-key',
      status: hex1 !== hex2 ? 'pass' : 'fail',
      detail:
        hex1 !== hex2
          ? 'Different key produces different HMAC'
          : 'Collision',
    });
  } catch (e: any) {
    results.push({
      name: 'hmac256-different-key',
      status: 'fail',
      detail: `Error: ${e.message}`,
    });
  }

  return results;
}
