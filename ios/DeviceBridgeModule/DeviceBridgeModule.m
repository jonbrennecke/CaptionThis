#import "DeviceBridgeModule.h"
#import "CaptionThis-Swift.h"
#import <Foundation/Foundation.h>

@implementation DeviceBridgeModule

RCT_EXPORT_MODULE(DeviceBridgeModule)

RCT_EXPORT_METHOD(isMemoryLimitedDevice : (RCTResponseSenderBlock)callback) {
  BOOL isMemoryLimitedDevice = [DeviceUtil isMemoryLimitedDevice];
  callback(@[ [NSNull null], @(isMemoryLimitedDevice) ]);
}

@end
