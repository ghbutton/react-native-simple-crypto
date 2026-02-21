#import "RNSCHmac.h"
#import "Hmac.h"

@implementation RNSCHmac

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(hmac256:(NSString *)base64 key:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSString *data = [Hmac hmac256:base64 key:key];
        if (data == nil) {
            reject(@"hmac_fail", @"HMAC error", nil);
        } else {
            resolve(data);
        }
    } @catch (NSException *exception) {
        reject(@"hmac_fail", exception.reason, nil);
    }
}
@end
