#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTViewManager.h>

@class TranscriptViewManager;
@interface TranscriptViewManager : RCTViewManager
- (void)updateAnimationWithView:(UIView *)view
                     withParams:(VideoAnimationParams *)animationParams;
@end
