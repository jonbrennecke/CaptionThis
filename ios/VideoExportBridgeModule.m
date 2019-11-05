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
    HSVideoExportManager.sharedInstance.delegate = self;
  }
  return self;
}

RCT_EXPORT_MODULE(VideoExport)

RCT_EXPORT_METHOD(exportVideo
                  : (NSDictionary<NSString *, id> *)json withCallback
                  : (RCTResponseSenderBlock)callback) {
  id captionStyleJson = [json objectForKey:@"captionStyle"];
  if (!captionStyleJson) {
    callback(@[
      RCTMakeError(@"JSON object is missing required parameter 'captionStyle'.",
                   nil, nil),
      @(NO)
    ]);
    return;
  }
  HSCaptionStyleJSON *captionStyle =
      [HSCaptionStyleJSON fromJSON:captionStyleJson];
  if (!captionStyle) {
    callback(@[
      RCTMakeError(@"Unable to convert caption style from JSON.", nil, nil),
      @(NO)
    ]);
    return;
  }

  id durationJson = [json objectForKey:@"duration"];
  if (!durationJson) {
    callback(@[
      RCTMakeError(@"JSON object is missing required parameter 'duration'.",
                   nil, nil),
      @(NO)
    ]);
    return;
  }
  NSNumber *duration = [RCTConvert NSNumber:durationJson];

  // MARK - textSegments
  id textSegmentsJson = [json objectForKey:@"textSegments"];
  if (!textSegmentsJson) {
    callback(@[
      RCTMakeError(@"JSON object is missing required key 'textSegments'", nil,
                   nil),
      @(NO)
    ]);
    return;
  }
  NSArray *jsonArray = [RCTConvert NSArray:textSegmentsJson];
  if (!jsonArray) {
    NSString *message = [NSString
        stringWithFormat:
            @"Unable to convert 'textSegments'. Provided value was '%@'",
            [RCTConvert NSString:textSegmentsJson]];
    callback(@[ RCTMakeError(message, nil, nil), @(NO) ]);
    return;
  }
  NSMutableArray<HSCaptionTextSegmentJSON *> *textSegments =
      [[NSMutableArray alloc] initWithCapacity:jsonArray.count];
  for (id jsonTextSegment in jsonArray) {
    HSCaptionTextSegmentJSON *textSegment =
        [HSCaptionTextSegmentJSON fromJSON:jsonTextSegment];
    if (!textSegment) {
      RCTLogWarn(@"Invalid text segment: %@",
                 [RCTConvert NSString:jsonTextSegment]);
      continue;
    }
    [textSegments addObject:textSegment];
  }

  id videoIdJson = [json objectForKey:@"video"];
  if (!videoIdJson) {
    callback(@[
      RCTMakeError(@"JSON object is missing required parameter 'video'.", nil,
                   nil),
      @(NO)
    ]);
    return;
  }
  CGSize viewSize = [RCTConvert CGSize:[json objectForKey:@"viewSize"]];
  NSString *assetID = [RCTConvert NSString:videoIdJson];
  HSExportVideoResult result = [HSVideoExportManager.sharedInstance
      exportVideoWithAssetID:assetID
                       style:captionStyle
                textSegments:textSegments
                    duration:(CFTimeInterval)[duration doubleValue]
                    viewSize:viewSize];
  if (result != HSExportVideoResultSuccess) {
    callback(@[ [NSNull null], @(NO) ]);
    return;
  }
  callback(@[ [NSNull null], @(YES) ]);
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
