#import "RNSCAes.h"
#import "Aes.h"

@implementation RNSCAes

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(encrypt:(NSString *)dataBase64 key:(NSString *)key iv:(NSString *)iv
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSString *base64 = [Aes encrypt:dataBase64 key:key iv:iv];
        if (base64 == nil) {
            reject(@"encrypt_fail", @"Encrypt error", nil);
        } else {
            resolve(base64);
        }
    } @catch (NSException *exception) {
        reject(@"encrypt_fail", exception.reason, nil);
    }
}

RCT_EXPORT_METHOD(decrypt:(NSString *)base64 key:(NSString *)key iv:(NSString *)iv
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSString *data = [Aes decrypt:base64 key:key iv:iv];
        if (data == nil) {
            reject(@"decrypt_fail", @"Decrypt failed", nil);
        } else {
            resolve(data);
        }
    } @catch (NSException *exception) {
        reject(@"decrypt_fail", exception.reason, nil);
    }
}

@end
