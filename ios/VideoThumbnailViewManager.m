#import "VideoThumbnailViewManager.h"
#import "CaptionThis-Swift.h"
#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>

@implementation VideoThumbnailViewManager

RCT_EXPORT_MODULE(VideoThumbnailViewManager)

- (UIView *)view {
  VideoThumbnailView *thumbnailView = [[VideoThumbnailView alloc] init];
  return (UIView *)thumbnailView;
}

RCT_CUSTOM_VIEW_PROPERTY(localIdentifier, NSString, VideoThumbnailView) {
  NSString *localIdentifier = [RCTConvert NSString:json];
  PHFetchResult<PHAsset *> *fetchResult =
      [PHAsset fetchAssetsWithLocalIdentifiers:@[ localIdentifier ]
                                       options:nil];
  PHAsset *asset = fetchResult.firstObject;
  if (asset == nil) {
    return;
  }
  if (![view isKindOfClass:[VideoThumbnailView class]]) {
    RCTLogError(
        @"View is not the correct class. Expected 'VideoThumbnailView'.");
    return;
  }
  view.asset = asset;
}

@end
