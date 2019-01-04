#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTViewManager.h>

@class SaturationAndBrightnessGradientWrappingView;
@interface SaturationAndBrightnessGradientWrappingView : UIView
@property(nonatomic, retain) SaturationAndBrightnessGradientView *wrappedView;
@property(nonatomic, copy) RCTBubblingEventBlock onDidUpdateColorAtOffset;
@end

@class SaturationAndBrightnessGradientViewManager;
@interface SaturationAndBrightnessGradientViewManager : RCTViewManager
- (CGFloat)normalize:(CGFloat)number;
@end
