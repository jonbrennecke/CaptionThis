#import "CameraPreviewView.h"

@implementation CameraPreviewView

- (void)layoutSubviews {
  [super layoutSubviews];
  _previewLayer.frame = self.bounds;
}

- (void)setPreviewLayer:(CALayer *)previewLayer {
  _previewLayer = previewLayer;
  [self.layer addSublayer:_previewLayer];
}

@end
