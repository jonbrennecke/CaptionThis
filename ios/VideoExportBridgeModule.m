#import "VideoExportBridgeModule.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+UIImageOrientation.h"
#import <React/RCTConvert.h>
#import <Speech/Speech.h>

@implementation VideoExportBridgeModule {
  bool hasListeners;
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"videoExportManagerDidFail", @"videoExportManagerDidFinish",
    @"videoExportManagerDidDidUpdateProgress"
  ];
}

- (instancetype)init {
  self = [super init];
  if (self) {
    VideoExportManager.sharedInstance.delegate = self;
  }
  return self;
}

RCT_EXPORT_MODULE(VideoExport)

RCT_EXPORT_METHOD(exportVideo
                  : (NSDictionary<NSString *, id> *)json withCallback
                  : (RCTResponseSenderBlock)callback) {
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

  id backgroundColorJson = [json objectForKey:@"backgroundColor"];
  if (backgroundColorJson) {
    UIColor *backgroundColor = [RCTConvert UIColor:backgroundColorJson];
    params.backgroundColor = backgroundColor;
  }

  id orientationJson = [json objectForKey:@"orientation"];
  if (orientationJson) {
    UIImageOrientation orientation =
        [RCTConvert UIImageOrientation:orientationJson];
    params.orientation = orientation;
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

  id videoIdJson = [json objectForKey:@"video"];
  if (videoIdJson) {
    NSString *localIdentifier = [RCTConvert NSString:videoIdJson];
    [VideoExportManager.sharedInstance
        exportVideoWithLocalIdentifier:localIdentifier
                                params:params];
    callback(@[ [NSNull null], @(YES) ]);
    return;
  } else {
    callback(@[ [NSNull null], @(NO) ]);
  }
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

@end

@implementation VideoExportBridgeModule (VideoExportManagerDelegate)

- (void)videoExportManagerDidFailWithError:(NSError *_Nonnull)_ {
  if (!hasListeners) {
    return;
  }
  [self sendEventWithName:@"videoExportManagerDidFail" body:@{}];
}

- (void)videoExportManagerDidFinishWithObjectPlaceholder:
    (PHObjectPlaceholder *_Nonnull)_ {
  if (!hasListeners) {
    return;
  }
  [self sendEventWithName:@"videoExportManagerDidFinish" body:@{}];
}

- (void)videoExportManagerDidDidUpdateProgress:(float)progress {
  if (!hasListeners) {
    return;
  }
  NSDictionary *body = @{ @"progress" : @(progress) };
  [self sendEventWithName:@"videoExportManagerDidDidUpdateProgress" body:body];
}

@end
