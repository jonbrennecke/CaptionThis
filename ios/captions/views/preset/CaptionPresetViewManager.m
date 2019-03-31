#import "CaptionPresetViewManager.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+CaptionPresetBackgroundStyle.h"
#import "RCTConvert+CaptionPresetLineStyle.h"
#import "RCTConvert+CaptionPresetTextAlignment.h"
#import "RCTConvert+CaptionPresetWordStyle.h"
#import "RCTConvert+TextSegment.h"
#import <UIKit/UIKit.h>

@implementation CaptionPresetViewManager

RCT_EXPORT_MODULE(CaptionPresetView)

RCT_CUSTOM_VIEW_PROPERTY(textAlignment, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionPresetTextAlignment textAlignment =
      [RCTConvert CaptionPresetTextAlignment:json];
  view.textAlignment = textAlignment;
}

RCT_CUSTOM_VIEW_PROPERTY(lineStyle, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionPresetLineStyle lineStyle = [RCTConvert CaptionPresetLineStyle:json];
  view.lineStyle = lineStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(wordStyle, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionPresetWordStyle wordStyle = [RCTConvert CaptionPresetWordStyle:json];
  view.wordStyle = wordStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundStyle, NSString *, CaptionPresetView) {
  if (![view isKindOfClass:[CaptionPresetView class]]) {
    return;
  }
  CaptionPresetBackgroundStyle backgroundStyle =
      [RCTConvert CaptionPresetBackgroundStyle:json];
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
  NSMutableArray<TextSegment*> *textSegments = [[NSMutableArray alloc] initWithCapacity:jsonArray.count];
  for (id jsonTextSegment in jsonArray) {
    TextSegment *textSegment = [RCTConvert TextSegment:jsonTextSegment];
    if (!textSegment) {
      // TODO: log error
      continue;
    }
    [textSegments addObject:textSegment];
  }
  view.textSegments = textSegments;
}

- (UIView *)view {
  CaptionPresetView *view = [[CaptionPresetView alloc] init];
  return (UIView *)view;
}

@end
