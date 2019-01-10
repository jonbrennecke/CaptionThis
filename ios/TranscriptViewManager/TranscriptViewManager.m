
#import "TranscriptViewManager.h"
#import "CaptionThis-Swift.h"
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTUIManager.h>

@implementation TranscriptViewManager

- (void)updateAnimationWithView:(UIView *)view
                     withParams:(VideoAnimationParams *)animationParams {
  dispatch_async(dispatch_get_main_queue(), ^{
    VideoAnimationLayer *animationLayer =
        [[VideoAnimationLayer alloc] initFor:VideoAnimationOutputKindView];
    animationLayer.frame =
        CGRectMake(0, 0, view.bounds.size.width, view.bounds.size.height);
    [animationLayer animateWithParams:animationParams];
    view.layer.sublayers = nil;
    [view.layer insertSublayer:animationLayer atIndex:0];
  });
}

#pragma MARK - React Native Module

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(restart : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        UIView *view = viewRegistry[reactTag];
        if (!view) {
          RCTLogError(@"Cannot find UIView with tag #%@", reactTag);
          return;
        }
        VideoAnimationLayer *animationLayer = view.layer.sublayers[0];
        if (!animationLayer ||
            ![animationLayer isKindOfClass:[VideoAnimationLayer class]]) {
          RCTLogError(@"Cannot find VideoAnimationLayer in view with tag #%@",
                      reactTag);
          return;
        }
        [animationLayer restart];
      }];
}

RCT_CUSTOM_VIEW_PROPERTY(animationParams, NSDictionary *, UIView) {
  VideoAnimationParams *params = [[VideoAnimationParams alloc] init];
  id textSegmentsJson = [json objectForKey:@"textSegments"];
  if (textSegmentsJson) {
    NSArray<TextSegmentParams *> *textSegments =
        [self convertTextSegments:textSegmentsJson];
    if (textSegments) {
      params.textSegments = textSegments;
    }
  }

  id fontFamilyJson = [json objectForKey:@"fontFamily"];
  if (fontFamilyJson) {
    NSString *fontFamily = [RCTConvert NSString:fontFamilyJson];
    params.fontFamily = fontFamily;
  }

  id fontSizeJson = [json objectForKey:@"fontSize"];
  if (fontSizeJson) {
    NSNumber *fontSize = [RCTConvert NSNumber:fontSizeJson];
    params.fontSize = fontSize;
  }

  id durationJson = [json objectForKey:@"duration"];
  if (durationJson) {
    NSNumber *duration = [RCTConvert NSNumber:durationJson];
    params.duration = duration;
  }

  id textColorJson = [json objectForKey:@"textColor"];
  if (textColorJson) {
    UIColor *textColor = [RCTConvert UIColor:textColorJson];
    params.textColor = textColor;
  }

  id backgroundColorJson = [json objectForKey:@"backgroundColor"];
  if (backgroundColorJson) {
    UIColor *backgroundColor = [RCTConvert UIColor:backgroundColorJson];
    params.backgroundColor = backgroundColor;
  }

  [self updateAnimationWithView:view withParams:params];
}

// TODO: extend RCTConvert
- (NSArray<TextSegmentParams *> *)convertTextSegments:(id)json {
  if (![json isKindOfClass:[NSArray class]]) {
    return nil;
  }
  NSMutableArray<TextSegmentParams *> *textSegments =
      [[NSMutableArray alloc] init];
  for (NSDictionary *segment in json) {
    NSString *text = [segment objectForKey:@"text"];
    NSNumber *duration = [segment objectForKey:@"duration"];
    NSNumber *timestamp = [segment objectForKey:@"timestamp"];
    TextSegmentParams *params =
        [[TextSegmentParams alloc] initWithText:text
                                       duration:[duration floatValue]
                                      timestamp:[timestamp floatValue]];
    [textSegments addObject:params];
  }
  return textSegments;
}

- (UIView *)view {
  UIView *view = [[UIView alloc] init];
  return view;
}

@end
