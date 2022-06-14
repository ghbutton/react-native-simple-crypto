'use strict';

import base64js from 'base64-js';
import hexLite from 'hex-lite';
import { NativeModules } from 'react-native';

function convertArrayBufferToUtf8(arrayBuffer) {
  const array = new Uint8Array(arrayBuffer);
  const chars = [];
  let i = 0;

  while (i < array.length) {
    const byte = array[i];
    if (byte < 128) {
      chars.push(String.fromCharCode(byte));
      i++;
    } else if (byte > 191 && byte < 224) {
      chars.push(
        String.fromCharCode(((byte & 0x1f) << 6) | (array[i + 1] & 0x3f))
      );
      i += 2;
    } else {
      chars.push(
        String.fromCharCode(
          ((byte & 0x0f) << 12) |
          ((array[i + 1] & 0x3f) << 6) |
          (array[i + 2] & 0x3f)
        )
      );
      i += 3;
    }
  }

  return chars.join('');
}

function convertUtf8ToArrayBuffer(utf8) {
  const bytes = [];

  let i = 0;
  utf8 = encodeURI(utf8);
  while (i < utf8.length) {
    const byte = utf8.charCodeAt(i++);
    if (byte === 37) {
      bytes.push(parseInt(utf8.substr(i, 2), 16));
      i += 2;
    } else {
      bytes.push(byte);
    }
  }

  const array = new Uint8Array(bytes);
  return array.buffer;
}

function convertArrayBufferToBase64(arrayBuffer) {
  return base64js.fromByteArray(new Uint8Array(arrayBuffer));
}

function convertBase64ToArrayBuffer(base64) {
  return base64js.toByteArray(base64).buffer;
}

const convertArrayBufferToHex = hexLite.fromBuffer;

const convertHexToArrayBuffer = hexLite.toBuffer;

async function randomBytes(length) {
  return convertBase64ToArrayBuffer(await NativeModules.RNSCRandomBytes.randomBytes(length));
}

async function SHAWrapper(data, algorithm) {
  if (typeof data === 'string') {
    return NativeModules.RNSCSha.shaUtf8(data, algorithm);
  } else {
    const dataBase64 = convertArrayBufferToBase64(data);
    const result = await NativeModules.RNSCSha.shaBase64(dataBase64, algorithm);

    return convertBase64ToArrayBuffer(result);
  }
}

const AES = {
  encrypt: async function (textArrayBuffer, keyArrayBuffer, ivArrayBuffer) {
    const textBase64 = convertArrayBufferToBase64(textArrayBuffer);
    const keyHex = convertArrayBufferToHex(keyArrayBuffer);
    const ivHex = convertArrayBufferToHex(ivArrayBuffer);
    return convertBase64ToArrayBuffer(await NativeModules.RNSCAes.encrypt(textBase64, keyHex, ivHex));
  },
  decrypt: async function (cipherTextArrayBuffer, keyArrayBuffer, ivArrayBuffer) {
    const cipherTextBase64 = convertArrayBufferToBase64(cipherTextArrayBuffer);
    const keyHex = convertArrayBufferToHex(keyArrayBuffer);
    const ivHex = convertArrayBufferToHex(ivArrayBuffer);
    return convertBase64ToArrayBuffer(await NativeModules.RNSCAes.decrypt(cipherTextBase64, keyHex, ivHex));
  }
};

const SHA = {
  sha1: async(data) => SHAWrapper(data, 'SHA-1'),
  sha256: async(data) => SHAWrapper(data, 'SHA-256'),
  sha512: async(data) => SHAWrapper(data, 'SHA-512')
};

const HMAC = {
  hmac256: async function (textArrayBuffer, keyArrayBuffer) {
    const textHex = convertArrayBufferToHex(textArrayBuffer);
    const keyHex = convertArrayBufferToHex(keyArrayBuffer);
    const signatureHex = await NativeModules.RNSCHmac.hmac256(textHex, keyHex);
    return convertHexToArrayBuffer(signatureHex);
  }
};

const PBKDF2 = {
  hash: async function (password, salt, iterations, keyLength, algorithm) {
    let passwordToHash = password;
    let saltToHash = salt;

    if (typeof password === 'string') {
      passwordToHash = convertUtf8ToArrayBuffer(password);
    }

    if (typeof salt === 'string') {
      saltToHash = convertUtf8ToArrayBuffer(salt);
    }

    const digest = await NativeModules.RNSCPbkdf2.hash(
      convertArrayBufferToBase64(passwordToHash),
      convertArrayBufferToBase64(saltToHash),
      iterations,
      keyLength,
      algorithm
    );

    return convertBase64ToArrayBuffer(digest);
  }
};

const RSA = NativeModules.RNSCRsa;

const utils = {
  randomBytes,
  convertArrayBufferToUtf8,
  convertUtf8ToArrayBuffer,
  convertArrayBufferToBase64,
  convertBase64ToArrayBuffer,
  convertArrayBufferToHex,
  convertHexToArrayBuffer
};

export default {
  AES,
  SHA,
  HMAC,
  PBKDF2,
  RSA,
  utils
};
