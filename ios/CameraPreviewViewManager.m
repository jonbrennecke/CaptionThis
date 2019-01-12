#import "CameraPreviewViewManager.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTUIManager.h>

@implementation CameraPreviewViewManager

@synthesize previewView;

RCT_EXPORT_MODULE(CameraPreviewManager)

RCT_EXPORT_METHOD(focusOnPoint
                  : (nonnull NSNumber *)reactTag focusPoint
                  : (id)pointJson) {
  CGPoint point = [RCTConvert CGPoint:pointJson];
  CameraManager *cameraManager = [AppDelegate sharedCameraManager];
  [cameraManager focusOnPoint:point];
}

- (UIView *)view {
  previewView = [[CameraPreviewView alloc] init];
  dispatch_async(dispatch_get_main_queue(), ^{
    CameraManager *cameraManager = [AppDelegate sharedCameraManager];
    self.previewView.previewLayer = cameraManager.previewLayer;
  });
  return (UIView *)previewView;
}

@end
