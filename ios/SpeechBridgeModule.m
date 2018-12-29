#import <Photos/Photos.h>
#import <React/RCTConvert.h>
#import "SpeechBridgeModule.h"
#import "AppDelegate.h"

@implementation SpeechBridgeModule
{
  bool hasListeners;
}

-(instancetype)init {
  self = [super init];
  if (self != nil) {
    AppDelegate.sharedSpeechManager.delegate = self;
  }
  return self;
}

#pragma mark - SpeechManagerDelegate

-(void)speechManagerDidBecomeAvailable {
  [self sendEventWithName:@"speechManagerDidBecomeAvailable" body:@{}];
}

-(void)speechManagerDidBecomeUnavailable {
  [self sendEventWithName:@"speechManagerDidBecomeUnavailable" body:@{}];
}

- (void)speechManagerDidReceiveSpeechTranscription:(SFTranscription * _Nonnull)transcription {
  NSString* formattedString = transcription.formattedString;
  NSMutableArray<NSDictionary*>* segments = [[NSMutableArray alloc] initWithCapacity:transcription.segments.count];
  for (SFTranscriptionSegment *segment in transcription.segments) {
    [segments addObject:@{
      @"duration": @(segment.duration),
      @"timestamp": @(segment.timestamp),
      @"confidence": @(segment.confidence),
      @"substring": segment.substring,
      @"alternativeSubstrings": segment.alternativeSubstrings
    }];
  }
  NSDictionary *body = @{
   @"formattedString": formattedString,
   @"segments": segments
  };
  [self sendEventWithName:@"speechManagerDidReceiveSpeechTranscription" body:body];
}


#pragma mark - React Native module

-(void)startObserving {
  hasListeners = YES;
}

-(void)stopObserving {
  hasListeners = NO;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
   @"speechManagerDidReceiveSpeechTranscription",
   @"speechManagerDidBecomeAvailable",
   @"speechManagerDidBecomeUnavailable"
  ];
}

RCT_EXPORT_MODULE(SpeechManager)

RCT_EXPORT_METHOD(beginSpeechTranscriptionWithLocalIdentifier:(NSString*)localIdentifier withCallback:(RCTResponseSenderBlock)callback) {
  PHFetchResult<PHAsset*> *fetchResult = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier] options:nil];
  PHAsset *asset = fetchResult.firstObject;
  if (asset == nil) {
    callback(@[[NSNull null], @(NO)]);
    return;
  }
  PHVideoRequestOptions* requestOptions = [[PHVideoRequestOptions alloc] init];
  requestOptions.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
  [PHImageManager.defaultManager
   requestAVAssetForVideo:asset
   options:requestOptions
   resultHandler:^(AVAsset *asset, AVAudioMix *audioMix, NSDictionary *info) {
       [AppDelegate.sharedSpeechManager
        startCaptureForAsset:asset
        callback:^(NSError *error, SFSpeechAudioBufferRecognitionRequest *request) {
          if (error != nil) {
            callback(@[error, @(NO)]);
            return;
          }
          callback(@[[NSNull null], @(YES)]);
       }];
   }];
}

@end
