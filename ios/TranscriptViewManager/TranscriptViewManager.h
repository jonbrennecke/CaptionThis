#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTViewManager.h>

@class TranscriptViewManager;
@interface TranscriptViewManager : RCTViewManager
@property(nonatomic, retain) VideoAnimationParams *animationParams;
- (void)updateAnimationWithView:(UIView *)view;
@end
