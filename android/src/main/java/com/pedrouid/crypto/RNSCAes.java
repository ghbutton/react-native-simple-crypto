package com.pedrouid.crypto;

import android.widget.Toast;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import java.util.UUID;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.InvalidKeyException;

import java.nio.charset.StandardCharsets;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;
import javax.crypto.Mac;

import org.spongycastle.crypto.ExtendedDigest;
import org.spongycastle.crypto.digests.SHA1Digest;
import org.spongycastle.crypto.digests.SHA224Digest;
import org.spongycastle.crypto.digests.SHA256Digest;
import org.spongycastle.crypto.digests.SHA384Digest;
import org.spongycastle.crypto.digests.SHA384Digest;
import org.spongycastle.crypto.digests.SHA512Digest;
import org.spongycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.spongycastle.crypto.PBEParametersGenerator;
import org.spongycastle.crypto.params.KeyParameter;
import org.spongycastle.util.encoders.Hex;

import android.util.Base64;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class RNSCAes extends ReactContextBaseJavaModule {

    private static final String CIPHER_ALGORITHM = "AES/CBC/PKCS7Padding";
    private static final String KEY_ALGORITHM = "AES";

    public RNSCAes(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNSCAes";
    }

    @ReactMethod
    public void encrypt(String dataBase64, String keyBase64, String ivBase64, Promise promise) {
        try {
            String result = encrypt(dataBase64, keyBase64, ivBase64);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("-1", e.getMessage());
        }
    }

    @ReactMethod
    public void decrypt(String data, String pwd, String iv, Promise promise) {
        try {
            String strs = decrypt(data, pwd, iv);
            promise.resolve(strs);
        } catch (Exception e) {
            promise.reject("-1", e.getMessage());
        }
    }

    @ReactMethod
    public void randomUuid(Promise promise) {
        try {
            String result = UUID.randomUUID().toString();
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("-1", e.getMessage());
        }
    }

    @ReactMethod
    public void randomKey(Integer length, Promise promise) {
        try {
            byte[] key = new byte[length];
            SecureRandom rand = new SecureRandom();
            rand.nextBytes(key);
            String keyHex = Util.bytesToHex(key);
            promise.resolve(keyHex);
        } catch (Exception e) {
            promise.reject("-1", e.getMessage());
        }
    }

    final static IvParameterSpec emptyIvSpec = new IvParameterSpec(new byte[] {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00});

    private static String encrypt(String textBase64, String hexKey, String hexIv) throws Exception {
        if (textBase64 == null || textBase64.length() == 0) {
            return null;
        }

        byte[] key = Hex.decode(hexKey);
        SecretKey secretKey = new SecretKeySpec(key, KEY_ALGORITHM);

        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, hexIv == null ? emptyIvSpec : new IvParameterSpec(Hex.decode(hexIv)));
        byte[] encrypted = cipher.doFinal(Base64.decode(textBase64, Base64.NO_WRAP));
        return Base64.encodeToString(encrypted, Base64.NO_WRAP);
    }

    private static String decrypt(String ciphertext, String hexKey, String hexIv) throws Exception {
        if(ciphertext == null || ciphertext.length() == 0) {
            return null;
        }

        byte[] key = Hex.decode(hexKey);
        SecretKey secretKey = new SecretKeySpec(key, KEY_ALGORITHM);

        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, hexIv == null ? emptyIvSpec : new IvParameterSpec(Hex.decode(hexIv)));
        byte[] decrypted = cipher.doFinal(Base64.decode(ciphertext, Base64.NO_WRAP));
        return Base64.encodeToString(decrypted, Base64.NO_WRAP);
    }

}
