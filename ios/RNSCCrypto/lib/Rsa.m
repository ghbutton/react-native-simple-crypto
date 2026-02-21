#import "Rsa.h"
#import "RsaFormatter.h"

typedef void (^SecKeyPerformBlock)(SecKeyRef key);

@interface Rsa ()
@property (nonatomic) SecKeyRef publicKeyRef;
@property (nonatomic) SecKeyRef privateKeyRef;
@end

@implementation Rsa

- (void)generate:(int)keySize {
    NSMutableDictionary *privateKeyAttributes = [NSMutableDictionary dictionary];

	NSMutableDictionary *attributes = [[NSMutableDictionary alloc] init];
    [attributes setObject:(__bridge id)kSecAttrKeyTypeRSA forKey:(__bridge id)kSecAttrKeyType];
    [attributes setObject:[NSNumber numberWithInt:keySize] forKey:(__bridge id)kSecAttrKeySizeInBits];
	[attributes setObject:privateKeyAttributes forKey:(__bridge id)kSecPrivateKeyAttrs];

    CFErrorRef error = NULL;
    SecKeyRef privateKey = SecKeyCreateRandomKey((__bridge CFDictionaryRef)attributes, &error);

    if (!privateKey) {
        NSError *err = CFBridgingRelease(error);
        NSLog(@"%@", err);
    }

    _privateKeyRef = privateKey;
    _publicKeyRef = SecKeyCopyPublicKey(privateKey);
}

- (void)deletePrivateKey {
    self.privateKey = nil;
}

- (NSString *)encodedPublicKey {
    return [self externalRepresentationForPublicKey:self.publicKeyRef];
}

- (NSString *)encodedPrivateKey {
    return [self externalRepresentationForPrivateKey:self.privateKeyRef];
}

- (void)setPublicKey:(NSString *)publicKey {
    publicKey = [RsaFormatter stripHeaders: publicKey];
    NSData *data = [[NSData alloc] initWithBase64EncodedString:publicKey options:NSDataBase64DecodingIgnoreUnknownCharacters];
    if (data == nil) {
        NSLog(@"setPublicKey: invalid base64 data");
        _publicKeyRef = nil;
        return;
    }
    NSDictionary* options = @{(id)kSecAttrKeyType: (id)kSecAttrKeyTypeRSA,
                              (id)kSecAttrKeyClass: (id)kSecAttrKeyClassPublic,
//                              (id)kSecAttrKeySizeInBits: @2048,
                              };
    CFErrorRef error = NULL;
    SecKeyRef key = SecKeyCreateWithData((__bridge CFDataRef)data,
                                         (__bridge CFDictionaryRef)options,
                                         &error);
    if (!key) {
        NSError *err = CFBridgingRelease(error);
        NSLog(@"%@", err);
        _publicKeyRef = nil;
    } else {
        // Verify the key is valid by round-tripping its external representation
        CFErrorRef verifyError = NULL;
        CFDataRef keyData = SecKeyCopyExternalRepresentation(key, &verifyError);
        if (keyData == NULL) {
            NSLog(@"setPublicKey: key validation failed - corrupted key");
            CFRelease(key);
            _publicKeyRef = nil;
        } else {
            CFRelease(keyData);
            _publicKeyRef = key;
        }
    }
}

- (void)setPrivateKey:(NSString *)privateKey {
    privateKey = [RsaFormatter stripHeaders: privateKey];
    NSData *data = [[NSData alloc] initWithBase64EncodedString:privateKey options:NSDataBase64DecodingIgnoreUnknownCharacters];
    if (data == nil) {
        NSLog(@"setPrivateKey: invalid base64 data");
        _privateKeyRef = nil;
        return;
    }
    NSDictionary* options = @{(id)kSecAttrKeyType: (id)kSecAttrKeyTypeRSA,
                              (id)kSecAttrKeyClass: (id)kSecAttrKeyClassPrivate,
//                              (id)kSecAttrKeySizeInBits: @2048,
                              };
    CFErrorRef error = NULL;
    SecKeyRef key = SecKeyCreateWithData((__bridge CFDataRef)data,
                                         (__bridge CFDictionaryRef)options,
                                         &error);
    if (!key) {
        NSError *err = CFBridgingRelease(error);
        NSLog(@"%@", err);
        _privateKeyRef = nil;
    } else {
        // Verify the key is valid by round-tripping its external representation
        CFErrorRef verifyError = NULL;
        CFDataRef keyData = SecKeyCopyExternalRepresentation(key, &verifyError);
        if (keyData == NULL) {
            NSLog(@"setPrivateKey: key validation failed - corrupted key");
            CFRelease(key);
            _privateKeyRef = nil;
        } else {
            CFRelease(keyData);
            _privateKeyRef = key;
        }
    }
}

- (NSString *)encrypt64:(NSString*)message {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:message options:NSDataBase64DecodingIgnoreUnknownCharacters];
    NSData *encrypted = [self _encrypt: data];
    return [encrypted base64EncodedStringWithOptions:0];
}

- (NSString *)encrypt:(NSString *)message {
    NSData *data = [message dataUsingEncoding:NSUTF8StringEncoding];
    NSData *encrypted = [self _encrypt: data];
    return [encrypted base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

- (NSData *)_encrypt:(NSData *)data {
    if (self.publicKeyRef == nil) {
        return nil;
    }

    __block NSData *cipherText = nil;

    void(^encryptor)(SecKeyRef) = ^(SecKeyRef publicKey) {
        BOOL canEncrypt = SecKeyIsAlgorithmSupported(publicKey,
                                                     kSecKeyOperationTypeEncrypt,
                                                     kSecKeyAlgorithmRSAEncryptionPKCS1);
        if (canEncrypt) {
            CFErrorRef error = NULL;
            cipherText = (NSData *)CFBridgingRelease(SecKeyCreateEncryptedData(publicKey,
                                                                               kSecKeyAlgorithmRSAEncryptionPKCS1,
                                                                               (__bridge CFDataRef)data,
                                                                               &error));
            if (!cipherText) {
                NSError *err = CFBridgingRelease(error);
                NSLog(@"%@", err);
            }
        }
    };

    encryptor(self.publicKeyRef);
    return cipherText;
}

- (NSString *)decrypt64:(NSString*)message {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:message options:NSDataBase64DecodingIgnoreUnknownCharacters];
    NSData *decrypted = [self _decrypt: data];
    return [decrypted base64EncodedStringWithOptions:0];
}

- (NSString *)decrypt:(NSString *)message {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:message options:NSDataBase64DecodingIgnoreUnknownCharacters];
    NSData *decrypted = [self _decrypt: data];
    return [[NSString alloc] initWithData:decrypted encoding:NSUTF8StringEncoding];
}

- (NSData *)_decrypt:(NSData *)data {
    if (self.privateKeyRef == nil) {
        return nil;
    }

    __block NSData *clearText = nil;

    void(^decryptor)(SecKeyRef) = ^(SecKeyRef privateKey) {

        BOOL canDecrypt = SecKeyIsAlgorithmSupported(privateKey,
                                                     kSecKeyOperationTypeDecrypt,
                                                     kSecKeyAlgorithmRSAEncryptionPKCS1);
        if (canDecrypt) {
            CFErrorRef error = NULL;
            clearText = (NSData *)CFBridgingRelease(SecKeyCreateDecryptedData(privateKey,
                                                                              kSecKeyAlgorithmRSAEncryptionPKCS1,
                                                                              (__bridge CFDataRef)data,
                                                                              &error));
            if (!clearText) {
                NSError *err = CFBridgingRelease(error);
                NSLog(@"%@", err);
            }
        }
    };

    decryptor(self.privateKeyRef);
    return clearText;
}

- (NSString *)sign64:(NSString *)b64message withAlgorithm:(SecKeyAlgorithm)algorithm andError:(NSError **)anError {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:b64message options:NSDataBase64DecodingIgnoreUnknownCharacters];
    NSString *encodedSignature = [self _sign:data withAlgorithm:algorithm andError:anError];
    return encodedSignature;
}

- (NSString *)sign:(NSString *)message withAlgorithm:(SecKeyAlgorithm)algorithm andError:(NSError **)anError {
    NSData* data = [message dataUsingEncoding:NSUTF8StringEncoding];
    NSString *encodedSignature = [self _sign:data withAlgorithm:algorithm andError:anError];
    return encodedSignature;
}

- (NSString *)_sign:(NSData *)messageBytes withAlgorithm:(SecKeyAlgorithm)algorithm andError:(NSError **)anError {
    if (self.privateKeyRef == nil) {
        NSDictionary *errorDetail = @{
            NSLocalizedDescriptionKey: @"sign failed: private key is nil"
        };
        *anError = [NSError errorWithDomain:@"react-native-simple-crypto" code:0 userInfo:errorDetail];
        return nil;
    }

    __block NSString *encodedSignature = nil;

    if (algorithm == kSecKeyAlgorithmRSASignatureDigestPKCS1v15Raw && [self getKeyLength] < [messageBytes length]) {
        NSDictionary *errorDetail = @{
            NSLocalizedDescriptionKey: [NSString stringWithFormat:@"sign: Message length %lu is bigger than key length %lu",(unsigned long)[messageBytes length], (unsigned long)[self getKeyLength]]
        };
        *anError = [NSError errorWithDomain:@"react-native-simple-crypto" code:0 userInfo:errorDetail];
        return nil;
    }


    void(^signer)(SecKeyRef) = ^(SecKeyRef privateKey) {
        BOOL canSign = SecKeyIsAlgorithmSupported(privateKey,
                                                kSecKeyOperationTypeSign,
                                                algorithm);

        NSData* signature = nil;

        if (canSign) {
            CFErrorRef error = NULL;
            signature = (NSData*)CFBridgingRelease(SecKeyCreateSignature(privateKey,
                                                                         algorithm,
                                                                         (__bridge CFDataRef)messageBytes,
                                                                         &error));
            if (!signature) {
              *anError = CFBridgingRelease(error);
              NSLog(@"error: %@", *anError);
            }
        }

        encodedSignature = [signature base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
    };

    signer(self.privateKeyRef);
    if (*anError != nil) {
        return nil;
    }
    return encodedSignature;
}

- (BOOL)verify64:(NSString *)encodedSignature withMessage:(NSString *)b64message andAlgorithm:(SecKeyAlgorithm)algorithm {
    NSData *messageBytes = [[NSData alloc] initWithBase64EncodedString:b64message options:NSDataBase64DecodingIgnoreUnknownCharacters];
    NSData *signatureBytes = [[NSData alloc] initWithBase64EncodedString:encodedSignature options:NSDataBase64DecodingIgnoreUnknownCharacters];
    return [self _verify: signatureBytes withMessage: messageBytes andAlgorithm:algorithm];
}

- (BOOL)verify:(NSString *)encodedSignature withMessage:(NSString *)message andAlgorithm:(SecKeyAlgorithm)algorithm {
    NSData *messageBytes = [message dataUsingEncoding:NSUTF8StringEncoding];
    NSData *signatureBytes = [[NSData alloc] initWithBase64EncodedString:encodedSignature options:NSDataBase64DecodingIgnoreUnknownCharacters];
    return [self _verify: signatureBytes withMessage: messageBytes andAlgorithm:algorithm];
}

- (BOOL)_verify:(NSData *)signatureBytes withMessage:(NSData *)messageBytes andAlgorithm:(SecKeyAlgorithm)algorithm {
    if (self.publicKeyRef == nil) {
        return NO;
    }

    __block BOOL result = NO;

    void(^verifier)(SecKeyRef) = ^(SecKeyRef publicKey) {
        BOOL canVerify = SecKeyIsAlgorithmSupported(publicKey,
                                                    kSecKeyOperationTypeVerify,
                                                    algorithm);

        if (canVerify) {
            CFErrorRef error = NULL;
            result = SecKeyVerifySignature(publicKey,
                                           algorithm,
                                           (__bridge CFDataRef)messageBytes,
                                           (__bridge CFDataRef)signatureBytes,
                                           &error);
            if (!result) {
                NSError *err = CFBridgingRelease(error);
                NSLog(@"error: %@", err);
            }
        }
    };

    verifier(self.publicKeyRef);
    return result;
}

- (NSString *) externalRepresentationForPublicKey:(SecKeyRef)key {
    NSData *keyData = [self dataForKey:key];
    return [RsaFormatter PEMFormattedPublicKey:keyData];
}

- (NSString *) externalRepresentationForPrivateKey:(SecKeyRef)key {
    NSData *keyData = [self dataForKey:key];
    return [RsaFormatter PEMFormattedPrivateKey:keyData];
}

- (NSUInteger) getKeyLength {
    return SecKeyGetBlockSize(self.privateKeyRef);
}

- (NSData *)dataForKey:(SecKeyRef)key {
    CFErrorRef error = NULL;
    NSData * keyData = (NSData *)CFBridgingRelease(SecKeyCopyExternalRepresentation(key, &error));

    if (!keyData) {
        NSError *err = CFBridgingRelease(error);
        NSLog(@"%@", err);
    }

    return keyData;
}

@end
