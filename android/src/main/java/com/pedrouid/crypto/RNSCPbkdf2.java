package com.pedrouid.crypto;

import android.util.Base64;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.spongycastle.crypto.ExtendedDigest;
import org.spongycastle.crypto.PBEParametersGenerator;
import org.spongycastle.crypto.digests.SHA1Digest;
import org.spongycastle.crypto.digests.SHA224Digest;
import org.spongycastle.crypto.digests.SHA256Digest;
import org.spongycastle.crypto.digests.SHA384Digest;
import org.spongycastle.crypto.digests.SHA512Digest;
import org.spongycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.spongycastle.crypto.params.KeyParameter;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

public class RNSCPbkdf2 extends ReactContextBaseJavaModule {

    public RNSCPbkdf2(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNSCPbkdf2";
    }

    @ReactMethod
    public void hash(String pwdBase64, String saltBase64, Integer iterations, Integer keyLen, String hash, Promise promise) {
        try {
            byte[] pwdBytes = Base64.decode(pwdBase64, Base64.NO_WRAP);
            byte[] saltBytes = Base64.decode(saltBase64, Base64.NO_WRAP);
            byte[] digest = pbkdf2(pwdBytes, saltBytes, iterations, keyLen, hash);
            promise.resolve(Base64.encodeToString(digest, Base64.NO_WRAP));
        } catch (Exception e) {
            promise.reject("-1", e.getMessage());
        }
    }

    private static byte[] pbkdf2(byte[] pwd, byte[] salt, Integer iterations, Integer keyLen, String hash) throws NullPointerException, NoSuchAlgorithmException {
        Map<String, ExtendedDigest> algMap = new HashMap<String, ExtendedDigest>();
        algMap.put("SHA1", new SHA1Digest());
        algMap.put("SHA224", new SHA224Digest());
        algMap.put("SHA256", new SHA256Digest());
        algMap.put("SHA384", new SHA384Digest());
        algMap.put("SHA512", new SHA512Digest());
        ExtendedDigest alg = algMap.get(hash);

        if (alg == null) {
            throw new NoSuchAlgorithmException("Specified hash algorithm is not supported");
        }

        PBEParametersGenerator gen = new PKCS5S2ParametersGenerator(alg);
        gen.init(pwd, salt, iterations);
        return ((KeyParameter) gen.generateDerivedParameters(keyLen * 8)).getKey();
    }
}
