
#import "TranscriptViewManager.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+UIImageOrientation.h"
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTUIManager.h>

@implementation TranscriptViewManager

- (void)updateAnimationWithView:(CaptionsView *)view
                     withParams:(VideoAnimationBridgeParams *)animationParams {
  dispatch_async(dispatch_get_main_queue(), ^{
    [view animateWithParams:animationParams];
  });
}

#pragma MARK - React Native Module

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(play : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     CaptionsView *view = (CaptionsView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[CaptionsView class]]) {
       RCTLogError(@"Cannot find CaptionsView with tag #%@", reactTag);
       return;
     }
     [view resume];
   }];
}

RCT_EXPORT_METHOD(restart : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        CaptionsView *view = (CaptionsView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[CaptionsView class]]) {
          RCTLogError(@"Cannot find CaptionsView with tag #%@", reactTag);
          return;
        }
        [view restart];
      }];
}

RCT_EXPORT_METHOD(pause : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        CaptionsView *view = (CaptionsView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[CaptionsView class]]) {
          RCTLogError(@"Cannot find CaptionsView with tag #%@", reactTag);
          return;
        }
        [view pause];
      }];
}

RCT_EXPORT_METHOD(seekToTime
                  : (nonnull NSNumber *)reactTag time
                  : (nonnull NSNumber *)time) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        CaptionsView *view = (CaptionsView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[CaptionsView class]]) {
          RCTLogError(@"Cannot find CaptionsView with tag #%@", reactTag);
          return;
        }
        [view seekToTime:[time doubleValue]];
      }];
}

RCT_CUSTOM_VIEW_PROPERTY(isReadyToPlay, BOOL, CaptionsView) {
  if (!view || ![view isKindOfClass:[CaptionsView class]]) {
    RCTLogError(@"Cannot find CaptionsView");
    return;
  }
  BOOL isReadyToPlay = [RCTConvert BOOL:json];
  if (isReadyToPlay) {
    [view resume];
  } else {
    [view pause];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(animationParams, NSDictionary *, CaptionsView) {
  if (!view || ![view isKindOfClass:[CaptionsView class]]) {
    RCTLogError(@"Cannot find CaptionsView");
    return;
  }
  VideoAnimationBridgeParams *params =
      [[VideoAnimationBridgeParams alloc] init];
  id textSegmentsJson = [json objectForKey:@"textSegments"];
  if (textSegmentsJson) {
    NSArray<VideoAnimationBridgeTextSegmentParams *> *textSegments =
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

  id orientationJson = [json objectForKey:@"orientation"];
  if (orientationJson) {
    UIImageOrientation orientation =
        [RCTConvert UIImageOrientation:orientationJson];
    params.orientation = orientation;
  }

  id backgroundColorJson = [json objectForKey:@"backgroundColor"];
  if (backgroundColorJson) {
    UIColor *backgroundColor = [RCTConvert UIColor:backgroundColorJson];
    params.backgroundColor = backgroundColor;
  }

  id lineStyleJson = [json objectForKey:@"lineStyle"];
  if (lineStyleJson) {
    NSString *lineStyleString = [RCTConvert NSString:lineStyleJson];
    if ([lineStyleString isEqualToString:@"oneLine"]) {
      VideoAnimationBridgeLineStyle lineStyle =
          VideoAnimationBridgeLineStyleOneLine;
      params.lineStyle = lineStyle;
    } else if ([lineStyleString isEqualToString:@"twoLines"]) {
      VideoAnimationBridgeLineStyle lineStyle =
          VideoAnimationBridgeLineStyleTwoLines;
      params.lineStyle = lineStyle;
    } else {
      RCTLogError(@"The value '%@' is not a valid line style.",
                  lineStyleString);
    }
  }

  [self updateAnimationWithView:view withParams:params];
}

// TODO: extend RCTConvert
- (NSArray<VideoAnimationBridgeTextSegmentParams *> *)convertTextSegments:
    (id)json {
  if (![json isKindOfClass:[NSArray class]]) {
    return nil;
  }
  NSMutableArray<VideoAnimationBridgeTextSegmentParams *> *textSegments =
      [[NSMutableArray alloc] init];
  for (NSDictionary *segment in json) {
    NSString *text = [segment objectForKey:@"text"];
    NSNumber *duration = [segment objectForKey:@"duration"];
    NSNumber *timestamp = [segment objectForKey:@"timestamp"];
    VideoAnimationBridgeTextSegmentParams *params =
        [[VideoAnimationBridgeTextSegmentParams alloc]
            initWithText:text
                duration:[duration floatValue]
               timestamp:[timestamp floatValue]];
    [textSegments addObject:params];
  }
  return textSegments;
}

- (UIView *)view {
  CaptionsView *view = [[CaptionsView alloc] init];
  return (UIView *)view;
}

@end
