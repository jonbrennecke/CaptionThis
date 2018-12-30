#import "HueGradientViewManager.h"
#import "CaptionThis-Swift.h"

@implementation HueGradientViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(color, NSString, UIView) {
}

- (UIView*)view {
  HueGradientView *view = [[HueGradientView alloc] init];
  return (UIView*)view;
}

@end
