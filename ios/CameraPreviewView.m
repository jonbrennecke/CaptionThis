#import "CameraPreviewView.h"
#import "AppDelegate.h"
#import "Debug.h"

@implementation CameraPreviewView

@synthesize previewLayer;

- (void)layoutSubviews {
  [super layoutSubviews];
  previewLayer.frame = self.bounds;
}

- (void)setUp {
  [Debug logWithMessage:@"Setting up camera preview"];
  CameraManager *cameraManager = [AppDelegate sharedCameraManager];
  previewLayer = cameraManager.previewLayer;
  previewLayer.frame = self.bounds;
  self.layer.sublayers = nil;
  [self.layer addSublayer:previewLayer];
  [self layoutSubviews];
}

@end
