
#import <React/RCTConvert.h>
#import "TranscriptViewManager.h"
#import "CaptionThis-Swift.h"

@implementation TranscriptViewManager

@synthesize animationParams;

- (instancetype)init
{
  self = [super init];
  if (self) {
    animationParams = [[VideoAnimationParams alloc] init];
  }
  return self;
}

- (void)updateAnimationWithView:(UIView*)view {
  dispatch_async(dispatch_get_main_queue(), ^{
    VideoAnimationLayer* animationLayer = [[VideoAnimationLayer alloc] initFor:VideoAnimationOutputKindView];
    animationLayer.frame = CGRectMake(0, 0, view.frame.size.width, view.frame.size.height);
    [animationLayer animateWithParams:self->animationParams];
    animationLayer.beginTime = CACurrentMediaTime();
    [view.layer insertSublayer:animationLayer atIndex:0];
  });
}

#pragma MARK - React Native Module

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(textSegments, NSArray*, UIView) {
  NSMutableArray<TextSegmentParams*>* textSegments = [[NSMutableArray alloc] init];
  for (NSDictionary* segment in json) {
    NSString* text = [segment objectForKey:@"text"];
    NSNumber* duration = [segment objectForKey:@"duration"];
    NSNumber* timestamp = [segment objectForKey:@"timestamp"];
    TextSegmentParams* params = [[TextSegmentParams alloc] initWithText:text duration:[duration floatValue] timestamp:[timestamp floatValue]];
    [textSegments addObject:params];
  }
  animationParams.textSegments = textSegments;
  [self updateAnimationWithView:view];
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundColor, UIColor*, UIView) {
  UIColor* backgroundColor = [RCTConvert UIColor:json];
  animationParams.backgroundColor = backgroundColor;
  [self updateAnimationWithView:view];
}

RCT_CUSTOM_VIEW_PROPERTY(textColor, UIColor*, UIView) {
  UIColor* textColor = [RCTConvert UIColor:json];
  animationParams.textColor = textColor;
  [self updateAnimationWithView:view];
}

RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString*, UIView) {
  NSString* fontFamily = [RCTConvert NSString:json];
  animationParams.fontFamily = fontFamily;
  [self updateAnimationWithView:view];
}

- (UIView*)view {
  UIView *view = [[UIView alloc] init];
  return view;
}

@end
