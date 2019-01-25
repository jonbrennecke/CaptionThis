#import "VideoSeekbarPreviewViewManager.h"
#import "CaptionThis-Swift.h"
#import "Debug.h"
#import <Photos/Photos.h>

@implementation VideoSeekbarPreviewViewManager

RCT_EXPORT_MODULE()

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
                 [self generateImagesWithAsset:asset
                                      withView:(VideoSeekbarPreviewView *)view];
               }];
}

- (UIView *)view {
  VideoSeekbarPreviewView *view = [[VideoSeekbarPreviewView alloc] init];
  return (UIView *)view;
}

- (void)generateImagesWithAsset:(AVAsset *)asset
                       withView:(VideoSeekbarPreviewView *)view {
  AVAssetImageGenerator *assetImageGenerator =
      [[AVAssetImageGenerator alloc] initWithAsset:asset];
  assetImageGenerator.appliesPreferredTrackTransform = YES;
  NSMutableArray<NSValue *> *times = [[NSMutableArray alloc] init];
  Float64 duration = CMTimeGetSeconds(asset.duration);
  Float64 step = duration / SEEKBAR_NUMBER_OF_PREVIEW_FRAMES;
  for (Float64 seconds = 0; seconds < duration; seconds += step) {
    CMTime time = CMTimeMakeWithSeconds(seconds, 600);
    NSValue *timeValue = [NSValue valueWithCMTime:time];
    [times addObject:timeValue];
  }
  [assetImageGenerator
      generateCGImagesAsynchronouslyForTimes:times
                           completionHandler:^(
                               CMTime requestedTime,
                               CGImageRef _Nullable cgImage, CMTime actualTime,
                               AVAssetImageGeneratorResult result,
                               NSError *_Nullable error) {
                             if (error != nil) {
                               [Debug logWithError:error];
                               return;
                             }
                             if (!cgImage) {
                               [Debug logWithFormat:
                                          @"AVAssetImageGenerator "
                                          @"resultHandler was called, but no "
                                          @"CGImage was generated. Result = %@",
                                          result, nil];
                               return;
                             }
                             UIImage *image = [UIImage imageWithCGImage:cgImage];
                             NSUInteger index = [times
                                 indexOfObject:
                                     [NSValue valueWithCMTime:requestedTime]];
                             [view setImage:image atIndex:index];
                           }];
}

@end
