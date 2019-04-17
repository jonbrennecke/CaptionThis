#import "CaptionViewManager.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+CaptionPresetBackgroundStyle.h"
#import "RCTConvert+CaptionPresetLineStyle.h"
#import "RCTConvert+CaptionPresetTextAlignment.h"
#import "RCTConvert+CaptionPresetWordStyle.h"
#import "RCTConvert+CaptionTextSegment.h"
#import <UIKit/UIKit.h>

@implementation CaptionViewManager

RCT_EXPORT_MODULE(CaptionViewManager)

RCT_CUSTOM_VIEW_PROPERTY(textAlignment, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionPresetTextAlignment textAlignment =
  [RCTConvert CaptionPresetTextAlignment:json];
  view.textAlignment = textAlignment;
}

RCT_CUSTOM_VIEW_PROPERTY(lineStyle, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionPresetLineStyle lineStyle = [RCTConvert CaptionPresetLineStyle:json];
  view.lineStyle = lineStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(wordStyle, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionPresetWordStyle wordStyle = [RCTConvert CaptionPresetWordStyle:json];
  view.wordStyle = wordStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundStyle, NSString *, CaptionView) {
  if (![view isKindOfClass:[CaptionView class]]) {
    return;
  }
  CaptionPresetBackgroundStyle backgroundStyle =
  [RCTConvert CaptionPresetBackgroundStyle:json];
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

- (UIView *)view {
  CaptionView *view = [[CaptionView alloc] init];
  return (UIView *)view;
}


@end
