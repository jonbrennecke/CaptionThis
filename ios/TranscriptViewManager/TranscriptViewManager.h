#pragma once

#import <React/RCTViewManager.h>
#import "CaptionThis-Swift.h"

@class TranscriptViewManager;
@interface TranscriptViewManager : RCTViewManager
@property (nonatomic, retain) VideoAnimationParams* animationParams;
- (void)updateAnimationWithView:(UIView*)view;
@end
