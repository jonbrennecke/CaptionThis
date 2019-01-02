#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>
#import "VideoPlayerViewManager.h"
#import "CaptionThis-Swift.h"

@implementation VideoPlayerViewWrap
@synthesize playerView;

- (instancetype)init
{
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

- (void)videoPlayerDidFailToLoad {
  if (!self.onVideoDidFailToLoad) {
    return;
  }
  self.onVideoDidFailToLoad(@{});
}

- (void)videoPlayerDidBecomeReadyToPlayAsset:(AVAsset*)asset {
  if (!self.onVideoDidBecomeReadyToPlay) {
    return;
  }
  NSNumber* duration = [NSNumber numberWithFloat:CMTimeGetSeconds(asset.duration)];
  self.onVideoDidBecomeReadyToPlay(@{ @"duration": duration });
}

- (void)videoPlayerDidPause {
  if (!self.onVideoDidPause) {
    return;
  }
  NSDictionary* body = @{};
  self.onVideoDidPause(body);
}

- (void)videoPlayerDidUpdatePlaybackTime:(CMTime)time duration:(CMTime)duration {
  if (!self.onVideoDidUpdatePlaybackTime) {
    return;
  }
  NSNumber* durationNumber = [NSNumber numberWithFloat:CMTimeGetSeconds(duration)];
  NSNumber* playbackTimeNumber = [NSNumber numberWithFloat:CMTimeGetSeconds(time)];
  NSDictionary* body = @{
    @"duration": durationNumber,
    @"playbackTime": playbackTimeNumber
  };
  self.onVideoDidUpdatePlaybackTime(body);
}

@end

@implementation VideoPlayerViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onVideoDidBecomeReadyToPlay, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidFailToLoad, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidPause, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidUpdatePlaybackTime, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(localIdentifier, NSString, UIView) {
  NSString* localIdentifier = [RCTConvert NSString:json];
  PHFetchResult<PHAsset*> *fetchResult = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier] options:nil];
  PHAsset *asset = fetchResult.firstObject;
  if (asset == nil) {
    return;
  }
  PHVideoRequestOptions* requestOptions = [[PHVideoRequestOptions alloc] init];
  requestOptions.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
  [PHImageManager.defaultManager
   requestAVAssetForVideo:asset
   options:requestOptions
   resultHandler:^(AVAsset * _Nullable asset, AVAudioMix * _Nullable audioMix, NSDictionary * _Nullable info) {
     VideoPlayerViewWrap *playerViewWrap = (VideoPlayerViewWrap*)view;
     playerViewWrap.playerView.asset = asset;
   }];
}

RCT_CUSTOM_VIEW_PROPERTY(startPosition, NSNumber, VideoPlayerViewWrap) {
  NSNumber* startPosition = [RCTConvert NSNumber:json];
  CMTime time = CMTimeMakeWithSeconds([startPosition floatValue], 1);
  [view.playerView seekTo:time completionHandler:^(BOOL success) {
    [view.playerView play];
  }];
}

- (UIView*)view {
  VideoPlayerViewWrap *view = [[VideoPlayerViewWrap alloc] init];
  return view;
}

@end
