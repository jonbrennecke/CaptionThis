#import "CameraPreviewViewManager.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"
#import <AVFoundation/AVFoundation.h>

@implementation CameraPreviewViewManager

@synthesize previewView;

RCT_EXPORT_MODULE(CameraPreviewManager)

- (UIView *)view {
  previewView = [[CameraPreviewView alloc] init];
  dispatch_async(dispatch_get_main_queue(), ^{
    CameraManager *cameraManager = [AppDelegate sharedCameraManager];
    self.previewView.previewLayer = cameraManager.previewLayer;
  });
  return (UIView *)previewView;
}

@end
