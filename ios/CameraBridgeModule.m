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

RCT_EXPORT_METHOD(startCameraCapture) {
  [[AppDelegate sharedCameraManager] startCapture];
}

RCT_EXPORT_METHOD(stopCameraCapture) {
  [[AppDelegate sharedCameraManager] stopCapture];
}

@end
