#import "CaptionViewManager.h"
#import "CaptionThis-Swift.h"
#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation CaptionViewManager

RCT_EXPORT_MODULE(CaptionViewManager)

RCT_CUSTOM_VIEW_PROPERTY(captionStyle, NSData, HSCaptionView) {
  if (![view isKindOfClass:[HSCaptionView class]]) {
    return;
  }
  view.captionStyle = [HSCaptionStyleJSON fromJSON:json];
}

RCT_CUSTOM_VIEW_PROPERTY(duration, NSNumber *, HSCaptionView) {
  if (![view isKindOfClass:[HSCaptionView class]]) {
    return;
  }
  NSNumber *duration = [RCTConvert NSNumber:json];
  view.duration = [duration doubleValue];
}

RCT_CUSTOM_VIEW_PROPERTY(textSegments, NSDictionary *, HSCaptionView) {
  if (![view isKindOfClass:[HSCaptionView class]]) {
    return;
  }
  NSArray<id> *jsonArray = [RCTConvert NSArray:json];
  NSMutableArray<HSCaptionTextSegmentJSON*> *textSegments = [[NSMutableArray alloc] initWithCapacity:jsonArray.count];
  for (id jsonTextSegment in jsonArray) {
    HSCaptionTextSegmentJSON *textSegment = [HSCaptionTextSegmentJSON fromJSON:jsonTextSegment];
    if (!textSegment) {
      continue;
    }
    [textSegments addObject:textSegment];
  }
  view.textSegments = textSegments;
}

RCT_EXPORT_METHOD(play : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     HSCaptionView *view = (HSCaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[HSCaptionView class]]) {
       RCTLogError(@"Cannot find HSCaptionView with tag #%@", reactTag);
       return;
     }
     [view resume];
   }];
}

RCT_EXPORT_METHOD(restart : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     HSCaptionView *view = (HSCaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[HSCaptionView class]]) {
       RCTLogError(@"Cannot find HSCaptionView with tag #%@", reactTag);
       return;
     }
     [view restart];
   }];
}

RCT_EXPORT_METHOD(pause : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     HSCaptionView *view = (HSCaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[HSCaptionView class]]) {
       RCTLogError(@"Cannot find HSCaptionView with tag #%@", reactTag);
       return;
     }
     [view pause];
   }];
}

RCT_EXPORT_METHOD(seekToTime
                  : (nonnull NSNumber *)reactTag time
                  : (nonnull NSNumber *)time) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     HSCaptionView *view = (HSCaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[HSCaptionView class]]) {
       RCTLogError(@"Cannot find HSCaptionView with tag #%@", reactTag);
       return;
     }
     [view seekToTime:[time doubleValue]];
   }];
}

- (UIView *)view {
  HSCaptionView *view = [[HSCaptionView alloc] init];
  return (UIView *)view;
}

@end
