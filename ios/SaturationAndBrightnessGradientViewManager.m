#import "SaturationAndBrightnessGradientViewManager.h"
#import "CaptionThis-Swift.h"

@implementation SaturationAndBrightnessGradientViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(hue, NSString, UIView) {
  // TODO:
}

- (UIView*)view {
  SaturationAndBrightnessGradientView *view = [[SaturationAndBrightnessGradientView alloc] init];
  return (UIView*)view;
}

@end
