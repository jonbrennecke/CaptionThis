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
  UIColor* color = [view.wrappedView colorAtOffset:offsetPoint];;
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
