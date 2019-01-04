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
  if (!thumbnail) {
    return;
  }
  if (hasListeners) {
    [self sendEventWithName:@"mediaLibraryDidOutputThumbnail"
                       body:@{
                         @"size" : @(size),
                         @"image" : thumbnail
                       }];
  }
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
  return @[ @"mediaLibraryDidOutputThumbnail" ];
}

RCT_EXPORT_MODULE(MediaLibrary)

RCT_EXPORT_METHOD(getVideoAssets : (RCTResponseSenderBlock)callback) {
  NSArray<PHAsset *> *assets =
      [AppDelegate.sharedMediaLibraryManager getVideoAssetsFromLibrary];
  NSMutableArray<NSString *> *localIdentifiers =
      [[NSMutableArray alloc] initWithCapacity:assets.count];
  [assets enumerateObjectsUsingBlock:^(PHAsset *_Nonnull asset, NSUInteger idx,
                                       BOOL *_Nonnull stop) {
    if (asset == nil) {
      return;
    }
    NSString *localIdentifier = asset.localIdentifier;
    [localIdentifiers insertObject:localIdentifier atIndex:idx];
  }];
  callback(@[ [NSNull null], localIdentifiers ]);
}

@end
