#import "CameraPreviewView.h"
#import "CaptionThis-Swift.h"
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
  CameraManager *cameraManager = CameraManager.sharedInstance;
  previewLayer = cameraManager.previewLayer;
  self.layer.sublayers = nil;
  [self.layer addSublayer:previewLayer];
  [self layoutSubviews];
}

@end
