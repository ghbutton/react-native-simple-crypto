#import "RNSCSha.h"
#import "Sha.h"

@implementation RNSCSha

RCT_EXPORT_MODULE()
 
RCT_EXPORT_METHOD(shaBase64:(NSString *)text :(NSString *)algorithm
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSString *data = [Sha shaBase64:text :algorithm];
        if (data == nil) {
            reject(@"shaBase64_fail", @"Hash error", nil);
        } else {
            resolve(data);
        }
    } @catch (NSException *exception) {
        reject(@"shaBase64_fail", exception.reason, nil);
    }
}

RCT_EXPORT_METHOD(shaUtf8:(NSString *)text :(NSString *)algorithm
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSString *data = [Sha shaUtf8:text :algorithm];
        if (data == nil) {
            reject(@"shaUtf8_fail", @"Hash error", nil);
        } else {
            resolve(data);
        }
    } @catch (NSException *exception) {
        reject(@"shaUtf8_fail", exception.reason, nil);
    }
}

@end
