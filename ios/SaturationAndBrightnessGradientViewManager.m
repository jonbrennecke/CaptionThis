#import "SaturationAndBrightnessGradientViewManager.h"
#import "CaptionThis-Swift.h"

@implementation SaturationAndBrightnessGradientWrappingView
@synthesize wrappedView;

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.wrappedView = [[SaturationAndBrightnessGradientView alloc] init];
    [self addSubview:self.wrappedView];
  }
  return self;
}

- (void)layoutSubviews {
  self.wrappedView.frame = self.bounds;
  [super layoutSubviews];
}

@end

@implementation SaturationAndBrightnessGradientViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onDidUpdateColorAtOffset, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(color, UIColor*, SaturationAndBrightnessGradientWrappingView) {
  UIColor* color = [RCTConvert UIColor:json];
  view.wrappedView.color = color;
}

RCT_CUSTOM_VIEW_PROPERTY(offset, NSDictionary*, SaturationAndBrightnessGradientWrappingView) {
  NSDictionary* offsetDict = [RCTConvert NSDictionary:json];
  NSNumber* offsetX = [offsetDict objectForKey:@"x"];
  NSNumber* offsetY = [offsetDict objectForKey:@"y"];
  if (offsetX == nil && offsetY != nil) {
    return;
  }
  CGPoint offsetPoint = CGPointMake([offsetX floatValue], [offsetY floatValue]);
  UIColor* color = [view.wrappedView colorAtOffset:offsetPoint];
  CGFloat rgba[4];
  BOOL success = [color getRed:&rgba[0] green:&rgba[1] blue:&rgba[2] alpha:&rgba[3]];
  if (!success) {
    return;
  }
  rgba[0] = [self normalize:rgba[0]];
  rgba[1] = [self normalize:rgba[1]];
  rgba[2] = [self normalize:rgba[2]];
  rgba[3] = [self normalize:rgba[3]];
  view.onDidUpdateColorAtOffset(@{
    @"red": [NSNumber numberWithFloat:rgba[0]],
    @"green": [NSNumber numberWithFloat:rgba[1]],
    @"blue": [NSNumber numberWithFloat:rgba[2]],
    @"alpha": [NSNumber numberWithFloat:rgba[3]]
  });
}

- (UIView*)view {
  SaturationAndBrightnessGradientWrappingView *view = [[SaturationAndBrightnessGradientWrappingView alloc] init];
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
