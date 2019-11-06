#import "HSCaptionViewManager.h"
#import "CaptionThis-Swift.h"
#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation HSCaptionViewManager

RCT_EXPORT_MODULE(HSCaptionViewManager)

RCT_CUSTOM_VIEW_PROPERTY(captionStyle, NSDictionary *, HSCaptionView) {
  if (![view isKindOfClass:[HSCaptionView class]]) {
    return;
  }
  NSError *error;
  NSData* data = [NSJSONSerialization dataWithJSONObject:json options:NSJSONWritingFragmentsAllowed error:&error];
  if (error) {
    RCTLogError(@"%@", error.localizedDescription);
    return;
  }
  HSCaptionStyleJSON *captionStyle = [HSCaptionStyleJSON fromJSON:data];
  if (!captionStyle) {
    RCTLogWarn(@"Failed to convert JSON %@", json);
    return;
  }
  view.captionStyle = captionStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(duration, NSNumber *, HSCaptionView) {
  if (![view isKindOfClass:[HSCaptionView class]]) {
    return;
  }
  NSNumber *duration = [RCTConvert NSNumber:json];
  view.duration = [duration doubleValue];
}

RCT_CUSTOM_VIEW_PROPERTY(textSegments, NSArray *, HSCaptionView) {
  if (![view isKindOfClass:[HSCaptionView class]]) {
    return;
  }
  NSArray<id> *jsonArray = [RCTConvert NSArray:json];
  NSMutableArray<HSCaptionTextSegmentJSON*> *textSegments = [[NSMutableArray alloc] initWithCapacity:jsonArray.count];
  for (id jsonTextSegment in jsonArray) {
    NSError *error;
    NSData* data = [NSJSONSerialization dataWithJSONObject:jsonTextSegment options:NSJSONWritingFragmentsAllowed error:&error];
    if (error) {
      RCTLogError(@"%@", error.localizedDescription);
      return;
    }
    HSCaptionTextSegmentJSON *textSegment = [HSCaptionTextSegmentJSON fromJSON:data];
    if (!textSegment) {
      RCTLogWarn(@"Failed to convert JSON %@", jsonTextSegment);
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

//RCT_EXPORT_METHOD(getCurrentPlaybackTime : (nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback) {
//  [self.bridge.uiManager
//   addUIBlock:^(RCTUIManager *uiManager,
//                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
//      HSCaptionView *view = (HSCaptionView *)viewRegistry[reactTag];
//      if (!view || ![view isKindOfClass:[HSCaptionView class]]) {
//        id error = RCTMakeError(@"Cannot find HSCaptionView with tag #%@", nil, nil);
//        callback(@[ error, [NSNull null] ]);
//        return;
//      }
//      CFTimeInterval playbackTime = [view currentPlaybackTime];
//      callback(@[ [NSNull null], @(playbackTime) ]);
//   }];
//}

- (UIView *)view {
  HSCaptionView *view = [[HSCaptionView alloc] init];
  return (UIView *)view;
}

@end
