#import "VideoSeekbarPreviewViewManager.h"
#import "CaptionThis-Swift.h"
#import "Debug.h"

@implementation VideoSeekbarPreviewViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(localIdentifier, NSString, VideoSeekbarView) {
  NSString *localIdentifier = [RCTConvert NSString:json];
  view.localIdentifier = localIdentifier;
}

- (UIView *)view {
  VideoSeekbarView *view = [[VideoSeekbarView alloc] init];
  return (UIView *)view;
}

@end
