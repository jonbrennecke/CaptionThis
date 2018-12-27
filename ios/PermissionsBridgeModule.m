#import "PermissionsBridgeModule.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"

@implementation PermissionsBridgeModule

RCT_EXPORT_MODULE(Permissons)

RCT_EXPORT_METHOD(requestAppPermissions:(RCTResponseSenderBlock)callback) {
  [[AppDelegate sharedPermissionsManager] requestAppPermissions:^(BOOL isAuthorized) {
    callback(@[[NSNull null], @(isAuthorized)]);
  }];
}

RCT_EXPORT_METHOD(arePermissionsGranted:(RCTResponseSenderBlock)callback) {
  const BOOL isAuthorized = [[AppDelegate sharedPermissionsManager] arePermissionsGranted];
  callback(@[[NSNull null], @(isAuthorized)]);
}


@end
