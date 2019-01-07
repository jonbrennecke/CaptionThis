#import "HueGradientViewManager.h"
#import "CaptionThis-Swift.h"

@implementation HueGradientViewWrappingView
@synthesize hueGradientView;

- (instancetype)init {
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

RCT_CUSTOM_VIEW_PROPERTY(color, UIColor *, HueGradientViewWrappingView) {
  UIColor *color = [RCTConvert UIColor:json];
  view.hueGradientView.color = color;
}

RCT_CUSTOM_VIEW_PROPERTY(offset, NSDictionary *, HueGradientViewWrappingView) {
  NSDictionary *offsetDict = [RCTConvert NSDictionary:json];
  NSNumber *offset = [offsetDict objectForKey:@"y"];
  if (offset == nil) {
    return;
  }
  UIColor *color =
      [view.hueGradientView colorAtOffset:[offset floatValue]];
  CGFloat rgba[4];
  BOOL success =
      [color getRed:&rgba[0] green:&rgba[1] blue:&rgba[2] alpha:&rgba[3]];
  if (!success) {
    return;
  }
  rgba[0] = [self normalize:rgba[0]];
  rgba[1] = [self normalize:rgba[1]];
  rgba[2] = [self normalize:rgba[2]];
  rgba[3] = [self normalize:rgba[3]];
  view.onDidUpdateColorAtOffset(@{
    @"red" : [NSNumber numberWithFloat:rgba[0]],
    @"green" : [NSNumber numberWithFloat:rgba[1]],
    @"blue" : [NSNumber numberWithFloat:rgba[2]],
    @"alpha" : [NSNumber numberWithFloat:rgba[3]]
  });
}

- (UIView *)view {
  HueGradientViewWrappingView *view =
      [[HueGradientViewWrappingView alloc] init];
  return (UIView *)view;
}

- (CGFloat)normalize:(CGFloat)number {
  if (isnan(number)) {
    return 0.0;
  } else if (isinf(number)) {
    return 1.0;
  }
  return MAX(MIN(1.0, number), 0.0);
}

@end
