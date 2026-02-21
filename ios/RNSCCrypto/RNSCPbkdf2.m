#import "RNSCPbkdf2.h"
#import "lib/Pbkdf2.h"

@implementation RNSCPbkdf2

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(hash:(NSString *)password
                  salt:(NSString *)salt
                  iterations:(int)iterations
                  keyLen:(int)keyLen
                  algorithm:(NSString *)algorithm
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSString *data = [Pbkdf2 hash:password salt:salt iterations:iterations keyLen:keyLen algorithm:algorithm];
        if (data == nil) {
            reject(@"keygen_fail", @"Key generation failed", nil);
        } else {
            resolve(data);
        }
    } @catch (NSException *exception) {
        reject(@"keygen_fail", exception.reason, nil);
    }
}
@end
