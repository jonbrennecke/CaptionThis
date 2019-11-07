#import "VideoExportBridgeModule.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+UIImageOrientation.h"
#import <React/RCTConvert.h>
#import <Speech/Speech.h>

@implementation VideoExportBridgeModule (Private)

- (HSCaptionStyleJSON *)
decodeCaptionStyleFromJSON:(id)json
               withJSError:(NSDictionary<NSString *, id> **)jsError {
  id captionStyleJson = [json objectForKey:@"captionStyle"];
  if (!captionStyleJson) {
    *jsError = RCTMakeError(
        @"JSON object is missing required parameter 'captionStyle'.", nil, nil);
    return nil;
  }
  NSError *error;
  NSData *data =
      [NSJSONSerialization dataWithJSONObject:captionStyleJson
                                      options:NSJSONWritingFragmentsAllowed
                                        error:&error];
  if (error) {
    *jsError = RCTMakeError(error.localizedDescription, nil, nil);
    return nil;
  }
  HSCaptionStyleJSON *captionStyle = [HSCaptionStyleJSON fromJSON:data];
  if (!captionStyle) {
    *jsError =
        RCTMakeError(@"Unable to convert caption style from JSON.", nil, nil);
    return nil;
  }
  return captionStyle;
}

- (NSArray<HSCaptionTextSegmentJSON *> *)
decodeCaptionTextSegmentsFromJSON:(id)json
                      withJSError:(NSDictionary<NSString *, id> **)jsError {
  id textSegmentsJson = [json objectForKey:@"textSegments"];
  if (!textSegmentsJson) {
    *jsError = RCTMakeError(
        @"JSON object is missing required key 'textSegments'", nil, nil);
    return nil;
  }
  NSArray *jsonArray = [RCTConvert NSArray:textSegmentsJson];
  if (!jsonArray) {
    NSString *message = [NSString
        stringWithFormat:
            @"Unable to convert 'textSegments'. Provided value was '%@'",
            [RCTConvert NSString:textSegmentsJson]];
    *jsError = RCTMakeError(message, nil, nil);
    return nil;
  }
  NSMutableArray<HSCaptionTextSegmentJSON *> *textSegments =
      [[NSMutableArray alloc] initWithCapacity:jsonArray.count];
  for (id jsonTextSegment in jsonArray) {
    NSError *error;
    NSData *data =
        [NSJSONSerialization dataWithJSONObject:jsonTextSegment
                                        options:NSJSONWritingFragmentsAllowed
                                          error:&error];
    if (error) {
      *jsError = RCTMakeError(error.localizedDescription, nil, nil);
      return nil;
    }
    HSCaptionTextSegmentJSON *textSegment =
        [HSCaptionTextSegmentJSON fromJSON:data];
    if (!textSegment) {
      NSString *message =
          [NSString stringWithFormat:@"Invalid text segment: %@",
                                     [RCTConvert NSString:jsonTextSegment]];
      *jsError = RCTMakeError(message, nil, nil);
      return nil;
    }
    [textSegments addObject:textSegment];
  }
  return textSegments;
}

@end

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
  // MARK - captionStyle
  NSDictionary<NSString *, id> *jsError;
  HSCaptionStyleJSON *captionStyle =
      [self decodeCaptionStyleFromJSON:json withJSError:&jsError];
  if (!captionStyle) {
    callback(@[ jsError, @(NO) ]);
    return;
  }

  // MARK - duration
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
  NSArray<HSCaptionTextSegmentJSON *> *textSegments =
      [self decodeCaptionTextSegmentsFromJSON:json withJSError:&jsError];
  if (!captionStyle) {
    callback(@[ jsError, @(NO) ]);
    return;
  }

  // MARK - video
  id videoIdJson = [json objectForKey:@"video"];
  if (!videoIdJson) {
    callback(@[
      RCTMakeError(@"JSON object is missing required parameter 'video'.", nil,
                   nil),
      @(NO)
    ]);
    return;
  }

  // MARK - viewSize
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
