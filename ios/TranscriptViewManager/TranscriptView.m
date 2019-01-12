#import "TranscriptView.h"
#import "CaptionThis-Swift.h"

@implementation TranscriptView

+ (Class)layerClass {
  return [VideoAnimationLayer class];
}

- (void)animateWithParams:(VideoAnimationParams *)params {
  VideoAnimationLayer *animationLayer = (VideoAnimationLayer *)self.layer;
  animationLayer.params = params;
}

@end
