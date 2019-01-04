#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTViewManager.h>

@class HueGradientViewManager;
@interface HueGradientViewWrappingView : UIView
@property(nonatomic, retain) HueGradientView *hueGradientView;
@property(nonatomic, copy) RCTBubblingEventBlock onDidUpdateColorAtOffset;
@end

@class HueGradientViewManager;
@interface HueGradientViewManager : RCTViewManager
- (CGFloat)normalize:(CGFloat)number;
@end
