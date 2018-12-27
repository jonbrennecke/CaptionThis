#import <React/RCTConvert.h>
#import "MediaLibraryBridgeModule.h"
#import "AppDelegate.h"

@implementation MediaLibraryBridgeModule
{
  bool hasListeners;
}

-(instancetype)init {
  self = [super init];
  if (self != nil) {
    AppDelegate.sharedMediaLibraryManager.delegate = self;
  }
  return self;
}

#pragma mark - MediaLibraryManagerDelegate

-(void)mediaLibraryManagerDidOutputThumbnail:(UIImage *)thumbnail forTargetSize:(CGSize)size {
  if (!thumbnail) {
    return;
  }
  if (hasListeners) {
    [self sendEventWithName:@"mediaLibraryDidOutputThumbnail" body:@{ @"size": @(size), @"image": thumbnail }];
  }
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
  return @[@"mediaLibraryDidOutputThumbnail"];
}

RCT_EXPORT_MODULE(MediaLibrary)

RCT_EXPORT_METHOD(requestVideoThumbailsForTargetSize:(CGSize)size) {
  [AppDelegate.sharedMediaLibraryManager requestVideoThumbnailsForTargetSize:size];
}

@end
