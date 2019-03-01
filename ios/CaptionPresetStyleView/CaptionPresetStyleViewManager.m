#import "CaptionPresetStyleViewManager.h"
#import "CaptionThis-Swift.h"
#import "RCTConvert+CaptionPresetLineStyle.h"
#import "RCTConvert+CaptionPresetTextAlignment.h"
#import "RCTConvert+CaptionPresetWordStyle.h"
#import <UIKit/UIKit.h>

@implementation CaptionPresetStyleViewManager

RCT_EXPORT_MODULE(CaptionPresetStyleView)

RCT_CUSTOM_VIEW_PROPERTY(textAlignment, NSString *, CaptionPresetStyleView) {
  if (![view isKindOfClass:[CaptionPresetStyleView class]]) {
    return;
  }
  CaptionPresetTextAlignment textAlignment =
      [RCTConvert CaptionPresetTextAlignment:json];
  view.textAlignment = textAlignment;
}

RCT_CUSTOM_VIEW_PROPERTY(lineStyle, NSString *, CaptionPresetStyleView) {
  if (![view isKindOfClass:[CaptionPresetStyleView class]]) {
    return;
  }
  CaptionPresetLineStyle lineStyle = [RCTConvert CaptionPresetLineStyle:json];
  view.lineStyle = lineStyle;
}

RCT_CUSTOM_VIEW_PROPERTY(wordStyle, NSString *, CaptionPresetStyleView) {
  if (![view isKindOfClass:[CaptionPresetStyleView class]]) {
    return;
  }
  CaptionPresetWordStyle wordStyle = [RCTConvert CaptionPresetWordStyle:json];
  view.wordStyle = wordStyle;
}

- (UIView *)view {
  CaptionPresetStyleView *view = [[CaptionPresetStyleView alloc] init];
  return (UIView *)view;
}

@end
