#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>
#import "VideoPlayerViewManager.h"
#import "CaptionThis-Swift.h"

@implementation VideoPlayerViewManager

RCT_EXPORT_MODULE(VideoPlayerViewManager)

- (UIView*)view {
  VideoPlayerView *playerView = [[VideoPlayerView alloc] init];
  return (UIView*)playerView;
}

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
     VideoPlayerView *playerView = (VideoPlayerView*)view;
     playerView.asset = asset;
   }];
}

@end
