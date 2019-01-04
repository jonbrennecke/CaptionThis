#import "VideoThumbnailViewManager.h"
#import "CaptionThis-Swift.h"
#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>

@implementation VideoThumbnailViewManager

RCT_EXPORT_MODULE(VideoThumbnailViewManager)

- (UIView *)view {
  UIImageView *imageView = [[UIImageView alloc] init];
  imageView.contentMode = UIViewContentModeScaleAspectFill;
  return (UIView *)imageView;
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
  CGSize size = CGSizeMake(100, 100 * 4 / 3);
  PHImageRequestOptions *requestOptions = [[PHImageRequestOptions alloc] init];
  requestOptions.synchronous = NO;
  requestOptions.deliveryMode =
      PHImageRequestOptionsDeliveryModeHighQualityFormat;
  [PHImageManager.defaultManager
      requestImageForAsset:asset
                targetSize:size
               contentMode:PHImageContentModeAspectFill
                   options:requestOptions
             resultHandler:^(UIImage *_Nullable image,
                             NSDictionary *_Nullable info) {
               UIImageView *imageView = (UIImageView *)view;
               imageView.image = image;
             }];
}

@end
