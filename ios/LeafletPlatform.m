#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LeafletPlatform, NSObject)

RCT_EXTERN_METHOD(requestLocationPermission:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end
