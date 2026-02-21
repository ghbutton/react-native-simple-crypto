#import <CommonCrypto/CommonCryptor.h>
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonKeyDerivation.h>

#import "Shared.h"
#import "Pbkdf2.h"

@implementation Pbkdf2

+ (NSString *) hash:(NSString *)password salt: (NSString *)salt iterations: (int)iterations keyLen: (int)keyLen algorithm: (NSString *)algorithm  {
    // Data of String to generate Hash key(hexa decimal string).
    NSData *passwordData = [[NSData alloc]initWithBase64EncodedString:password options:0];
    NSData *saltData = [[NSData alloc]initWithBase64EncodedString:salt options:0];

    // Hash key (hexa decimal) string data length.
    NSMutableData *hashKeyData = [NSMutableData dataWithLength:keyLen];
    
    NSDictionary *algMap = @{
     @"SHA1" : [NSNumber numberWithInt:kCCPRFHmacAlgSHA1],
     @"SHA224" : [NSNumber numberWithInt:kCCPRFHmacAlgSHA224],
     @"SHA256" : [NSNumber numberWithInt:kCCPRFHmacAlgSHA256],
     @"SHA384" : [NSNumber numberWithInt:kCCPRFHmacAlgSHA384],
     @"SHA512" : [NSNumber numberWithInt:kCCPRFHmacAlgSHA512],
    };
    
    NSNumber *algNumber = [algMap valueForKey:algorithm];
    if (algNumber == nil) {
        return nil;
    }
    int alg = [algNumber intValue];

    // Key Derivation using PBKDF2 algorithm.
    int status = CCKeyDerivationPBKDF(
                    kCCPBKDF2,
                    passwordData.bytes,
                    passwordData.length,
                    saltData.bytes,
                    saltData.length,
                    alg,
                    iterations,
                    hashKeyData.mutableBytes,
                    hashKeyData.length);

    if (status != kCCSuccess) {
        NSLog(@"Key derivation error, status: %d", status);
        return nil;
    }

    return [hashKeyData base64EncodedStringWithOptions:0];
}

@end
