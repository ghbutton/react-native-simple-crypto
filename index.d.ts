declare module "react-native-simple-crypto" {
  interface PublicKey {
    public: string;
  }

  interface KeyPair extends PublicKey {
    private: string;
  }

  export namespace AES {
    export function encrypt(
      text: ArrayBuffer,
      key: ArrayBuffer,
      iv: ArrayBuffer
    ): Promise<ArrayBuffer>;
    export function decrypt(
      ciphertext: ArrayBuffer,
      key: ArrayBuffer,
      iv: ArrayBuffer
    ): Promise<ArrayBuffer>;
  }

  export namespace SHA {
    export function sha1(text: string): Promise<string>;
    export function sha1(text: ArrayBuffer): Promise<ArrayBuffer>;
    export function sha256(text: string): Promise<string>;
    export function sha256(text: ArrayBuffer): Promise<ArrayBuffer>;
    export function sha512(text: string): Promise<string>;
    export function sha512(text: ArrayBuffer): Promise<ArrayBuffer>;
  }

  export namespace HMAC {
    export function hmac256(
      ciphertext: ArrayBuffer,
      key: ArrayBuffer
    ): Promise<ArrayBuffer>;
  }

  export namespace PBKDF2 {
    export function hash(
      password: string | ArrayBuffer,
      salt: string | ArrayBuffer,
      iterations: number,
      keyLen: number,
      algorithm: "SHA1" | "SHA224" | "SHA256" | "SHA384" | "SHA512"
    ): Promise<ArrayBuffer>;
  }

  export namespace RSA {
    export function generateKeys(keySize: number): Promise<KeyPair>;
    export function encrypt(data: string, key: string): Promise<string>;
    export function decrypt(data: string, key: string): Promise<string>;
    export function encrypt64(data: string, key: string): Promise<string>;
    export function decrypt64(data: string, key: string): Promise<string>;
    export function sign(
      data: string,
      key: string,
      hash: "Raw" | "SHA1" | "SHA224" | "SHA256" | "SHA384" | "SHA512"
    ): Promise<string>;
    export function verify(
      data: string,
      secretToVerify: string,
      key: string,
      hash: "Raw" | "SHA1" | "SHA224" | "SHA256" | "SHA384" | "SHA512"
    ): Promise<boolean>;
  }

  export namespace utils {
    export function randomBytes(bytes: number): Promise<ArrayBuffer>;
    export function convertArrayBufferToUtf8(input: ArrayBuffer): string;
    export function convertUtf8ToArrayBuffer(input: string): ArrayBuffer;
    export function convertArrayBufferToBase64(input: ArrayBuffer): string;
    export function convertBase64ToArrayBuffer(input: string): ArrayBuffer;
    export function convertArrayBufferToHex(input: ArrayBuffer): string;
    export function convertHexToArrayBuffer(input: string): ArrayBuffer;
  }
}
