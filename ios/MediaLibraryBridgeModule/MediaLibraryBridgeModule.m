#import "MediaLibraryBridgeModule.h"
#import "AppDelegate.h"
#import <Photos/PHAsset.h>
#import <React/RCTConvert.h>

@implementation MediaLibraryBridgeModule {
  bool hasListeners;
}

- (instancetype)init {
  self = [super init];
  if (self != nil) {
    AppDelegate.sharedMediaLibraryManager.delegate = self;
  }
  return self;
}

#pragma mark - MediaLibraryManagerDelegate

- (void)mediaLibraryManagerDidOutputThumbnail:(UIImage *)thumbnail
                                forTargetSize:(CGSize)size {
  if (!thumbnail || !hasListeners) {
    return;
  }
  [self sendEventWithName:@"mediaLibraryDidOutputThumbnail"
                     body:@{
                       @"size" : @(size),
                       @"image" : thumbnail
                     }];
}

- (void)mediaLibraryManagerDidUpdateVideos:(NSArray<PHAsset *> *)videoAssets {
  if (!hasListeners) {
    return;
  }
  NSMutableArray<NSDictionary *> *videos =
      [[NSMutableArray alloc] initWithCapacity:videoAssets.count];
  [videoAssets
      enumerateObjectsUsingBlock:^(PHAsset *_Nonnull asset, NSUInteger idx,
                                   BOOL *_Nonnull stop) {
        if (asset == nil) {
          return;
        }
        NSString *localIdentifier = asset.localIdentifier;
        NSTimeInterval duration = asset.duration;
        NSDictionary *video =
            @{ @"id" : localIdentifier,
               @"duration" : @(duration) };
        [videos insertObject:video atIndex:idx];
      }];
  [self sendEventWithName:@"mediaLibraryDidUpdateVideos"
                     body:@{@"videos" : videos}];
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
  return @[ @"mediaLibraryDidOutputThumbnail", @"mediaLibraryDidUpdateVideos" ];
}

RCT_EXPORT_MODULE(MediaLibrary)

RCT_EXPORT_METHOD(getVideos : (RCTResponseSenderBlock)callback) {
  NSArray<PHAsset *> *assets =
      [AppDelegate.sharedMediaLibraryManager getVideosFromLibrary];
  NSMutableArray<NSDictionary *> *videos =
      [[NSMutableArray alloc] initWithCapacity:assets.count];
  [assets enumerateObjectsUsingBlock:^(PHAsset *_Nonnull asset, NSUInteger idx,
                                       BOOL *_Nonnull stop) {
    if (asset == nil) {
      return;
    }
    NSString *localIdentifier = asset.localIdentifier;
    NSTimeInterval duration = asset.duration;
    NSDictionary *video =
        @{ @"id" : localIdentifier,
           @"duration" : @(duration) };
    [videos insertObject:video atIndex:idx];
  }];
  callback(@[ [NSNull null], videos ]);
}

RCT_EXPORT_METHOD(startObservingVideos) {
  [AppDelegate.sharedMediaLibraryManager startObservingVideos];
}

RCT_EXPORT_METHOD(stopObservingVideos) {
  [AppDelegate.sharedMediaLibraryManager stopObservingVideos];
}

@end
