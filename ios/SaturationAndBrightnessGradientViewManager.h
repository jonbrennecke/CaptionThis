#pragma once

#import <React/RCTViewManager.h>
#import "CaptionThis-Swift.h"

@class SaturationAndBrightnessGradientWrappingView;
@interface SaturationAndBrightnessGradientWrappingView : UIView
@property (nonatomic, retain) SaturationAndBrightnessGradientView* wrappedView;
@property (nonatomic, copy) RCTBubblingEventBlock onDidUpdateColorAtOffset;
@end

@class SaturationAndBrightnessGradientViewManager;
@interface SaturationAndBrightnessGradientViewManager : RCTViewManager
- (CGFloat)normalize:(CGFloat)number;
@end
