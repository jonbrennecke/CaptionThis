
#import <React/RCTConvert.h>
#import "TranscriptViewManager.h"
#import "CaptionThis-Swift.h"

@implementation TranscriptViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(textSegments, NSArray*, TranscriptView) {
  NSMutableArray<TextSegmentParams*>* textSegments = [[NSMutableArray alloc] init];
  for (NSDictionary* segment in json) {
    NSString* text = [segment objectForKey:@"text"];
    NSNumber* duration = [segment objectForKey:@"duration"];
    NSNumber* timestamp = [segment objectForKey:@"timestamp"];
    TextSegmentParams* params = [[TextSegmentParams alloc] initWithText:text duration:[duration floatValue] timestamp:[timestamp floatValue]];
    [textSegments addObject:params];
  }
  view.textSegments = textSegments;
}

RCT_CUSTOM_VIEW_PROPERTY(backgroundColor, UIColor*, TranscriptView) {
  UIColor* backgroundColor = [RCTConvert UIColor:json];
  view.backgroundColor = backgroundColor;
}

RCT_CUSTOM_VIEW_PROPERTY(textColor, UIColor*, TranscriptView) {
  UIColor* textColor = [RCTConvert UIColor:json];
  view.textColor = textColor;
}

RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString*, TranscriptView) {
  NSString* fontFamily = [RCTConvert NSString:json];
  view.fontFamily = fontFamily;
}

- (UIView*)view {
  TranscriptView *view = [[TranscriptView alloc] init];
  return (UIView*)view;
}

@end
