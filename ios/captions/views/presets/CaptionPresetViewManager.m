#import "CaptionPresetViewManager.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+CaptionBackgroundStyle.h"
#import "RCTConvert+CaptionLineStyle.h"
#import "RCTConvert+CaptionTextAlignment.h"
#import "RCTConvert+CaptionWordStyle.h"
#import "RCTConvert+CaptionTextSegment.h"
#import <UIKit/UIKit.h>

@implementation CaptionPresetViewManager

RCT_EXPORT_MODULE(CaptionPresetView)

RCT_CUSTOM_VIEW_PROPERTY(textAlignment, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionTextAlignment textAlignment =
      [RCTConvert CaptionTextAlignment:json];
  view.textAlignment = textAlignment;
}

RCT_CUSTOM_VIEW_PROPERTY(lineStyle, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionLineStyle lineStyle = [RCTConvert CaptionLineStyle:json];
  view.lineStyle = lineStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(wordStyle, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionWordStyle wordStyle = [RCTConvert CaptionWordStyle:json];
  view.wordStyle = wordStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundStyle, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionBackgroundStyle backgroundStyle =
      [RCTConvert CaptionBackgroundStyle:json];
  view.backgroundStyle = backgroundStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundColor, UIColor *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  UIColor *backgroundColor = [RCTConvert UIColor:json];
  view.captionBackgroundColor = backgroundColor;
}

RCT_CUSTOM_VIEW_PROPERTY(duration, NSNumber *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  NSNumber *duration = [RCTConvert NSNumber:json];
  view.duration = [duration doubleValue];
}

RCT_CUSTOM_VIEW_PROPERTY(textSegments, NSDictionary *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
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

RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  NSString *fontFamily = [RCTConvert NSString:json];
  view.fontFamily = fontFamily;
}

RCT_CUSTOM_VIEW_PROPERTY(textColor, UIColor *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  UIColor *textColor = [RCTConvert UIColor:json];
  view.textColor = textColor;
}

- (UIView *)view {
  CaptionPresetView *view = [[CaptionPresetView alloc] init];
  return (UIView *)view;
}

@end
