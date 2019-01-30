#import "SpeechBridgeModule.h"
#import "AppDelegate.h"
#import <Photos/Photos.h>
#import <React/RCTConvert.h>

@implementation SpeechBridgeModule {
  bool hasListeners;
}

- (instancetype)init {
  self = [super init];
  if (self != nil) {
    AppDelegate.sharedSpeechManager.delegate = self;
  }
  return self;
}

#pragma mark - SpeechManagerDelegate

- (void)speechManagerDidBecomeAvailable {
  if (!hasListeners) {
    return;
  }
  [self sendEventWithName:@"speechManagerDidBecomeAvailable" body:@{}];
}

- (void)speechManagerDidBecomeUnavailable {
  if (!hasListeners) {
    return;
  }
  [self sendEventWithName:@"speechManagerDidBecomeUnavailable" body:@{}];
}

- (void)speechManagerDidReceiveSpeechTranscriptionWithIsFinal:(BOOL)isFinal
                                                transcription:
                                                    (SFTranscription *)
                                                        transcription {
  if (!hasListeners) {
    return;
  }
  NSString *formattedString = transcription.formattedString;
  NSMutableArray<NSDictionary *> *segments =
      [[NSMutableArray alloc] initWithCapacity:transcription.segments.count];
  for (SFTranscriptionSegment *segment in transcription.segments) {
    [segments addObject:@{
      @"duration" : @(segment.duration),
      @"timestamp" : @(segment.timestamp),
      @"confidence" : @(segment.confidence),
      @"substring" : segment.substring,
      @"alternativeSubstrings" : segment.alternativeSubstrings
    }];
  }
  NSDictionary *body = @{
    @"isFinal" : @(isFinal),
    @"formattedString" : formattedString,
    @"segments" : segments
  };
  [self sendEventWithName:@"speechManagerDidReceiveSpeechTranscription"
                     body:body];
}

- (void)speechManagerDidNotDetectSpeech {
  if (!hasListeners) {
    return;
  }
  [self sendEventWithName:@"speechManagerDidNotDetectSpeech" body:@{}];
}

- (void)speechManagerDidTerminate {
  if (!hasListeners) {
    return;
  }
  [self sendEventWithName:@"speechManagerDidTerminate" body:@{}];
}

#pragma mark - React Native module

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
    @"speechManagerDidReceiveSpeechTranscription",
    @"speechManagerDidBecomeAvailable", @"speechManagerDidBecomeUnavailable",
    @"speechManagerDidNotDetectSpeech",
    @"speechManagerDidTerminate",
  ];
}

RCT_EXPORT_MODULE(SpeechManager)

RCT_EXPORT_METHOD(beginSpeechTranscriptionWithLocalIdentifier
                  : (NSString *)localIdentifier withCallback
                  : (RCTResponseSenderBlock)callback) {
  PHFetchResult<PHAsset *> *fetchResult =
      [PHAsset fetchAssetsWithLocalIdentifiers:@[ localIdentifier ]
                                       options:nil];
  PHAsset *asset = fetchResult.firstObject;
  if (asset == nil) {
    callback(@[ [NSNull null], @(NO) ]);
    return;
  }
  PHVideoRequestOptions *requestOptions = [[PHVideoRequestOptions alloc] init];
  requestOptions.deliveryMode =
      PHVideoRequestOptionsDeliveryModeHighQualityFormat;
  [PHImageManager.defaultManager
      requestAVAssetForVideo:asset
                     options:requestOptions
               resultHandler:^(AVAsset *asset, AVAudioMix *audioMix,
                               NSDictionary *info) {
                 [AppDelegate.sharedSpeechManager
                     startCaptureForAsset:asset
                                 callback:^(
                                     NSError *error,
                                     SFSpeechAudioBufferRecognitionRequest
                                         *request) {
                                   if (error != nil) {
                                     callback(@[ error, @(NO) ]);
                                     return;
                                   }
                                   callback(@[ [NSNull null], @(YES) ]);
                                 }];
               }];
}

RCT_EXPORT_METHOD(beginSpeechTranscriptionWithAudioSession
                  : (RCTResponseSenderBlock)callback) {
  [AppDelegate.sharedSpeechManager
      startCaptureForAudioSessionWithCallback:^(
          NSError *error, SFSpeechAudioBufferRecognitionRequest *request) {
        if (error != nil) {
          callback(@[ error, @(NO) ]);
          return;
        }
        callback(@[ [NSNull null], @(YES) ]);
      }];
}

RCT_EXPORT_METHOD(endSpeechTranscriptionWithAudioSession
                  : (RCTResponseSenderBlock)callback) {
  [AppDelegate.sharedSpeechManager stopCaptureForAudioSession];
  callback(@[ [NSNull null], @(YES) ]);
}

@end
