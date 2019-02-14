#import "VideoPlayerViewManager.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+UIImageOrientation.h"
#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation VideoPlayerViewWrap
@synthesize playerView;

- (instancetype)init {
  self = [super init];
  if (self) {
    playerView = [[VideoPlayerView alloc] init];
    playerView.delegate = self;
    [self addSubview:playerView];
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  playerView.frame = self.bounds;
}

- (void)removeFromSuperview {
  [super removeFromSuperview];
  [playerView stop];
}

#pragma mark - VideoPlayerViewDelegate

- (NSString *)stringForImageOrientation:(UIImageOrientation)orientation {
  NSDictionary *orientationToStringMap = @{
    @(UIImageOrientationUp) : @"up",
    @(UIImageOrientationUpMirrored) : @"upMirrored",
    @(UIImageOrientationDown) : @"down",
    @(UIImageOrientationDownMirrored) : @"downMirrored",
    @(UIImageOrientationLeft) : @"left",
    @(UIImageOrientationLeftMirrored) : @"leftMirrored",
    @(UIImageOrientationRight) : @"right",
    @(UIImageOrientationRightMirrored) : @"rightMirrored",
  };
  NSString *orientationStr =
      [orientationToStringMap objectForKey:@(orientation)];
  if (!orientationStr) {
    return [orientationToStringMap objectForKey:@(UIImageOrientationUp)];
  }
  return orientationStr;
}

- (void)videoPlayerDidFailToLoad {
  if (!self.onVideoDidFailToLoad) {
    return;
  }
  self.onVideoDidFailToLoad(@{});
}

- (void)videoPlayerDidBecomeReadyToPlayAsset:(AVAsset *)asset {
  [asset loadValuesAsynchronouslyForKeys:@[ @"tracks" ]
                       completionHandler:^{
                         if (!self.onVideoDidBecomeReadyToPlay) {
                           return;
                         }
                         UIImageOrientation orientation =
                             [OrientationUtil orientationForAsset:asset];
                         NSString *orientationStr =
                             [self stringForImageOrientation:orientation];
                         NSNumber *duration = [NSNumber
                             numberWithFloat:CMTimeGetSeconds(asset.duration)];
                         self.onVideoDidBecomeReadyToPlay(@{
                           @"duration" : duration,
                           @"orientation" : orientationStr
                         });
                       }];
}

- (void)videoPlayerDidPause {
  if (!self.onVideoDidPause) {
    return;
  }
  NSDictionary *body = @{};
  self.onVideoDidPause(body);
}

- (void)videoPlayerDidUpdatePlaybackTime:(CMTime)time
                                duration:(CMTime)duration {
  if (!self.onVideoDidUpdatePlaybackTime) {
    return;
  }
  NSNumber *durationNumber =
      [NSNumber numberWithFloat:CMTimeGetSeconds(duration)];
  NSNumber *playbackTimeNumber =
      [NSNumber numberWithFloat:CMTimeGetSeconds(time)];
  NSDictionary *body =
      @{@"duration" : durationNumber, @"playbackTime" : playbackTimeNumber};
  self.onVideoDidUpdatePlaybackTime(body);
}

- (void)videoPlayerDidRestartVideo {
  self.onVideoDidRestart(@{});
}

@end

@implementation VideoPlayerViewManager

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport {
  return @{
    @"up" : @(UIImageOrientationUp),
    @"upMirrored" : @(UIImageOrientationUpMirrored),
    @"down" : @(UIImageOrientationDown),
    @"downMirrored" : @(UIImageOrientationDownMirrored),
    @"left" : @(UIImageOrientationLeft),
    @"leftMirrored" : @(UIImageOrientationLeftMirrored),
    @"right" : @(UIImageOrientationRight),
    @"rightMirrored" : @(UIImageOrientationRightMirrored),
  };
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_EXPORT_VIEW_PROPERTY(onVideoDidBecomeReadyToPlay, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidFailToLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidPause, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidUpdatePlaybackTime, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidRestart, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(play : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        VideoPlayerViewWrap *view =
            (VideoPlayerViewWrap *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[VideoPlayerViewWrap class]]) {
          RCTLogError(@"Cannot find VideoPlayerView with tag #%@", reactTag);
          return;
        }
        [view.playerView play];
      }];
}

RCT_EXPORT_METHOD(pause : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        VideoPlayerViewWrap *view =
            (VideoPlayerViewWrap *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[VideoPlayerViewWrap class]]) {
          RCTLogError(@"Cannot find VideoPlayerView with tag #%@", reactTag);
          return;
        }
        [view.playerView pause];
      }];
}

RCT_EXPORT_METHOD(restart : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        VideoPlayerViewWrap *view =
            (VideoPlayerViewWrap *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[VideoPlayerViewWrap class]]) {
          RCTLogError(@"Cannot find VideoPlayerView with tag #%@", reactTag);
          return;
        }
        [view.playerView restartWithCompletionHandler:^(BOOL success) {
          [view.playerView play];
        }];
      }];
}

RCT_EXPORT_METHOD(seekToTime
                  : (nonnull NSNumber *)reactTag time
                  : (nonnull NSNumber *)seekTime
                  : (RCTResponseSenderBlock)callback) {
  [self.bridge.uiManager
      addUIBlock:^(RCTUIManager *uiManager,
                   NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        VideoPlayerViewWrap *view =
            (VideoPlayerViewWrap *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[VideoPlayerViewWrap class]]) {
          RCTLogError(@"Cannot find VideoPlayerView with tag #%@", reactTag);
          return;
        }
        CMTime time = CMTimeMakeWithSeconds([seekTime floatValue], 600);
        [view.playerView seekTo:time
              completionHandler:^(BOOL success){
                callback(@[ [NSNull null], @(success) ]);
              }];
      }];
}

RCT_CUSTOM_VIEW_PROPERTY(localIdentifier, NSString, UIView) {
  NSString *localIdentifier = [RCTConvert NSString:json];
  PHFetchResult<PHAsset *> *fetchResult =
      [PHAsset fetchAssetsWithLocalIdentifiers:@[ localIdentifier ]
                                       options:nil];
  PHAsset *asset = fetchResult.firstObject;
  if (asset == nil) {
    return;
  }
  PHVideoRequestOptions *requestOptions = [[PHVideoRequestOptions alloc] init];
  requestOptions.deliveryMode =
      PHImageRequestOptionsDeliveryModeHighQualityFormat;
  [PHImageManager.defaultManager
      requestAVAssetForVideo:asset
                     options:requestOptions
               resultHandler:^(AVAsset *_Nullable asset,
                               AVAudioMix *_Nullable audioMix,
                               NSDictionary *_Nullable info) {
                 VideoPlayerViewWrap *playerViewWrap =
                     (VideoPlayerViewWrap *)view;
                 playerViewWrap.playerView.asset = asset;
               }];
}

- (UIView *)view {
  VideoPlayerViewWrap *view = [[VideoPlayerViewWrap alloc] init];
  return view;
}

@end
