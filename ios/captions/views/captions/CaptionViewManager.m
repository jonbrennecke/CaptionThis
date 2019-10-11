#import "CaptionViewManager.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+CaptionBackgroundStyle.h"
#import "RCTConvert+CaptionLineStyle.h"
#import "RCTConvert+CaptionTextAlignment.h"
#import "RCTConvert+CaptionWordStyle.h"
#import "RCTConvert+CaptionTextSegment.h"
#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation CaptionViewManager

RCT_EXPORT_MODULE(CaptionViewManager)

RCT_CUSTOM_VIEW_PROPERTY(textAlignment, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionTextAlignment textAlignment = [RCTConvert CaptionTextAlignment:json];
  view.textAlignment = textAlignment;
}

RCT_CUSTOM_VIEW_PROPERTY(lineStyle, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionLineStyle lineStyle = [RCTConvert CaptionLineStyle:json];
  view.lineStyle = lineStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(wordStyle, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionWordStyle wordStyle = [RCTConvert CaptionWordStyle:json];
  view.wordStyle = wordStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundStyle, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionBackgroundStyle backgroundStyle =
    [RCTConvert CaptionBackgroundStyle:json];
  view.backgroundStyle = backgroundStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundColor, UIColor *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  UIColor *backgroundColor = [RCTConvert UIColor:json];
  view.captionBackgroundColor = backgroundColor;
}

RCT_CUSTOM_VIEW_PROPERTY(textColor, UIColor *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  UIColor *textColor = [RCTConvert UIColor:json];
  view.textColor = textColor;
}

RCT_CUSTOM_VIEW_PROPERTY(duration, NSNumber *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  NSNumber *duration = [RCTConvert NSNumber:json];
  view.duration = [duration doubleValue];
}

RCT_CUSTOM_VIEW_PROPERTY(fontSize, NSNumber *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  NSNumber *fontSize = [RCTConvert NSNumber:json];
  view.fontSize = [fontSize floatValue];
}

RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  NSString *fontFamily = [RCTConvert NSString:json];
  view.fontFamily = fontFamily;
}

RCT_CUSTOM_VIEW_PROPERTY(textSegments, NSDictionary *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  NSArray *jsonArray = [RCTConvert NSArray:json];
  NSMutableArray<CaptionTextSegment*> *textSegments = [[NSMutableArray alloc] initWithCapacity:jsonArray.count];
  for (id jsonTextSegment in jsonArray) {
    CaptionTextSegment *textSegment = [RCTConvert CaptionTextSegment:jsonTextSegment];
    if (!textSegment) {
      // TODO: log error
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
     CaptionView *view = (CaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[CaptionView class]]) {
       RCTLogError(@"Cannot find CaptionView with tag #%@", reactTag);
       return;
     }
     [view resume];
   }];
}

RCT_EXPORT_METHOD(restart : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     CaptionView *view = (CaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[CaptionView class]]) {
       RCTLogError(@"Cannot find CaptionView with tag #%@", reactTag);
       return;
     }
     [view restart];
   }];
}

RCT_EXPORT_METHOD(pause : (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     CaptionView *view = (CaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[CaptionView class]]) {
       RCTLogError(@"Cannot find CaptionView with tag #%@", reactTag);
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
     CaptionView *view = (CaptionView *)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[CaptionView class]]) {
       RCTLogError(@"Cannot find CaptionsView with tag #%@", reactTag);
       return;
     }
     [view seekToTime:[time doubleValue]];
   }];
}

- (UIView *)view {
  CaptionView *view = [[CaptionView alloc] init];
  return (UIView *)view;
}

@end
