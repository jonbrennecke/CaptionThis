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
  playerView.frame = self.bounds;
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
  Float64 durationF64 = CMTimeGetSeconds(asset.duration);
  NSNumber* duration = [NSNumber numberWithFloat:durationF64];
  self.onVideoDidBecomeReadyToPlay(@{ @"duration": duration });
}

@end

@implementation VideoPlayerViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onVideoDidBecomeReadyToPlay, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onVideoDidFailToLoad, RCTBubblingEventBlock)

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
