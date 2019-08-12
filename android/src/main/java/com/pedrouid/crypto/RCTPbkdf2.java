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

public class RCTPbkdf2 extends ReactContextBaseJavaModule {

    public RCTPbkdf2(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RCTPbkdf2";
    }

    @ReactMethod
    public void hash(String pwd, String saltBase64, Integer iterations, Integer keyLen, String hash, Promise promise) {
        try {
            String strs = pbkdf2(pwd, saltBase64, iterations, keyLen, hash);
            promise.resolve(strs);
        } catch (Exception e) {
            promise.reject("-1", e.getMessage());
        }
    }

    public static String bytesToHex(byte[] bytes) {
        final char[] hexArray = "0123456789abcdef".toCharArray();
        char[] hexChars = new char[bytes.length * 2];
        for ( int j = 0; j < bytes.length; j++ ) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        return new String(hexChars);
    }

    private static String pbkdf2(String pwd, String salt, Integer iterations, Integer keyLen, String hash) throws NoSuchAlgorithmException, InvalidKeySpecException {
        Map<String, ExtendedDigest> algMap = new HashMap<String, ExtendedDigest>();
        algMap.put("SHA1", new SHA1Digest());
        algMap.put("SHA224", new SHA224Digest());
        algMap.put("SHA256", new SHA256Digest());
        algMap.put("SHA384", new SHA384Digest());
        algMap.put("SHA512", new SHA512Digest());
        ExtendedDigest alg = algMap.get(hash);

        PBEParametersGenerator gen = new PKCS5S2ParametersGenerator(alg);
        byte[] saltBytes = Base64.decode(salt, Base64.DEFAULT);
        gen.init(pwd.getBytes(StandardCharsets.UTF_8), saltBytes, iterations);
        byte[] key = ((KeyParameter) gen.generateDerivedParameters(keyLen * 8)).getKey();
        return bytesToHex(key);
    }
}
