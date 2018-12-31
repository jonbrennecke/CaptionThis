#import <Photos/Photos.h>
#import "CameraBridgeModule.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"

@implementation CameraBridgeModule

RCT_EXPORT_MODULE(Camera)

RCT_EXPORT_METHOD(startCameraPreview) {
  CameraManager *cameraManager = [AppDelegate sharedCameraManager];
  [cameraManager setupCameraCaptureSession];
  [cameraManager startPreview];
}

RCT_EXPORT_METHOD(startCameraCapture:(RCTResponseSenderBlock)callback) {
  [[AppDelegate sharedCameraManager] startCaptureWithCompletionHandler:
   ^(NSError *error, BOOL success, PHObjectPlaceholder *placeholder) {
     if (error != nil) {
       callback(@[error, @(success), [NSNull null]]);
       return;
     }
     if (!placeholder) {
       callback(@[[NSNull null], @(NO), [NSNull null]]);
       return;
     }
     NSString *localIdentifier = placeholder.localIdentifier;
     callback(@[[NSNull null], @(YES), localIdentifier]);
  }];
}

RCT_EXPORT_METHOD(stopCameraCapture) {
  [[AppDelegate sharedCameraManager] stopCapture];
}

@end
