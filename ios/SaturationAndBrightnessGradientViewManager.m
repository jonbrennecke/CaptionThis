#import "SaturationAndBrightnessGradientViewManager.h"
#import "CaptionThis-Swift.h"

@implementation SaturationAndBrightnessGradientViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(color, UIColor*, SaturationAndBrightnessGradientView) {
  UIColor* color = [RCTConvert UIColor:json];
  view.color = color;
}

- (UIView*)view {
  SaturationAndBrightnessGradientView *view = [[SaturationAndBrightnessGradientView alloc] init];
  return (UIView*)view;
}

@end
