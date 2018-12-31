#import "HueGradientViewManager.h"
#import "CaptionThis-Swift.h"

@implementation HueGradientViewWrappingView
@synthesize hueGradientView;

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.hueGradientView = [[HueGradientView alloc] init];
    [self addSubview:self.hueGradientView];
  }
  return self;
}

- (void)layoutSubviews {
  self.hueGradientView.frame = self.bounds;
  [super layoutSubviews];
}

@end

@implementation HueGradientViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onDidUpdateColorAtOffset, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(color, UIColor*, HueGradientViewWrappingView) {
  UIColor* color = [RCTConvert UIColor:json];
  view.hueGradientView.color = color;
}

RCT_CUSTOM_VIEW_PROPERTY(offset, NSDictionary*, HueGradientViewWrappingView) {
  NSDictionary* offsetDict = [RCTConvert NSDictionary:json];
  NSNumber* offset = [offsetDict objectForKey:@"x"];
  if (offset == nil) {
    return;
  }
  UIColor* color = [view.hueGradientView colorAtHorizontalOffset:[offset floatValue]];
  CGFloat red = 0;
  CGFloat green = 0;
  CGFloat blue = 0;
  CGFloat alpha = 0;
  BOOL success = [color getRed:&red green:&green blue:&blue alpha:&alpha];
  if (!success) {
    return;
  }
  red = [self normalize:red];
  green = [self normalize:green];
  blue = [self normalize:blue];
  alpha = [self normalize:alpha];
  view.onDidUpdateColorAtOffset(@{
    @"red": [NSNumber numberWithFloat:red],
    @"green": [NSNumber numberWithFloat:green],
    @"blue": [NSNumber numberWithFloat:blue],
    @"alpha": [NSNumber numberWithFloat:alpha]
  });
}

- (UIView*)view {
  HueGradientViewWrappingView *view = [[HueGradientViewWrappingView alloc] init];
  return (UIView*)view;
}

- (CGFloat)normalize:(CGFloat)number {
  if (isnan(number)) {
    return 0.0;
  }
  else if (isinf(number)) {
    return 1.0;
  }
  return MAX(MIN(1.0, number), 0.0);
}

@end
