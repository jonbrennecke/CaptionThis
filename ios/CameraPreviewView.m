#import "CameraPreviewView.h"
#import "Debug.h"
#import "AppDelegate.h"

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
  self.layer.sublayers = nil;
  [self.layer addSublayer:previewLayer];
  [self layoutSubviews];
}

@end
