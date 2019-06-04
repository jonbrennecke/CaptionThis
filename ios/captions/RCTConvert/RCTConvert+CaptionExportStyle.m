#import "RCTConvert+CaptionExportStyle.h"
#import "RCTConvert+CaptionPresetTextAlignment.h"
#import "RCTConvert+CaptionLineStyle.h"
#import "RCTConvert+CaptionWordStyle.h"
#import "RCTConvert+CaptionPresetBackgroundStyle.h"
#import "RCTConvert+CaptionTextSegment.h"

@implementation RCTConvert (CaptionExportStyle)
+ (nullable CaptionExportStyle*)CaptionExportStyle:(nonnull id)json {
  NSDictionary *dict = [RCTConvert NSDictionary:json];
  if (!dict) {
    RCTLogWarn(@"Unable to convert json to dictionary.");
    return nil;
  }

  // MARK - textAlignment
  id textAlignmentJson = [json objectForKey:@"textAlignment"];
  if (!textAlignmentJson) {
    RCTLogWarn(@"JSON object is missing required key 'textAlignment'.");
    return nil;
  }
  CaptionPresetTextAlignment textAlignment = [RCTConvert CaptionPresetTextAlignment:textAlignmentJson];
  
  // MARK - lineStyle
  id lineStyleJson = [json objectForKey:@"lineStyle"];
  if (!lineStyleJson) {
    RCTLogWarn(@"JSON object is missing required key 'lineStyle'.");
    return nil;
  }
  CaptionLineStyle lineStyle = [RCTConvert CaptionLineStyle:lineStyleJson];
  
  // MARK - wordStyle
  id wordStyleJson = [json objectForKey:@"wordStyle"];
  if (!wordStyleJson) {
    RCTLogWarn(@"JSON object is missing required key 'wordStyle'.");
    return nil;
  }
  CaptionWordStyle wordStyle = [RCTConvert CaptionWordStyle:wordStyleJson];
  
  // MARK - backgroundStyle
  id backgroundStyleJson = [json objectForKey:@"backgroundStyle"];
  if (!backgroundStyleJson) {
    RCTLogWarn(@"JSON object is missing required key 'backgroundStyle'.");
    return nil;
  }
  CaptionPresetBackgroundStyle backgroundStyle = [RCTConvert CaptionPresetBackgroundStyle:backgroundStyleJson];
  
  // MARK - backgroundColor
  id backgroundColorJson = [json objectForKey:@"backgroundColor"];
  if (!backgroundColorJson) {
    RCTLogWarn(@"JSON object is missing required key 'backgroundColor'.");
    return nil;
  }
  UIColor *backgroundColor = [RCTConvert UIColor:backgroundColorJson];
  if (!backgroundColor) {
    RCTLogWarn(@"Unable to convert 'backgroundColor'. Provided value was '%@'", [RCTConvert NSString:backgroundColorJson]);
    return nil;
  }
  
  // MARK - fontFamily
  id fontFamilyJson = [json objectForKey:@"fontFamily"];
  if (!fontFamilyJson) {
    RCTLogWarn(@"JSON object is missing required key 'fontFamily'.");
    return nil;
  }
  NSString *fontFamily = [RCTConvert NSString:fontFamilyJson];
  if (!fontFamily) {
    RCTLogWarn(@"Unable to convert 'fontFamily'. Provided value was '%@'", [RCTConvert NSString:fontFamilyJson]);
    return nil;
  }
  
  // MARK - fontSize
  id fontSizeJson = [json objectForKey:@"fontSize"];
  if (!fontSizeJson) {
    RCTLogWarn(@"JSON object is missing required key 'fontSize'.");
    return nil;
  }
  NSNumber *fontSize = [RCTConvert NSNumber:fontSizeJson];
  if (!fontSize) {
    RCTLogWarn(@"Unable to convert 'fontSize'. Provided value was '%@'", [RCTConvert NSString:fontSizeJson]);
    return nil;
  }
  
  // MARK - font
  UIFont* font = [UIFont fontWithName:fontFamily size:[fontSize doubleValue]];
  if (!font) {
    font = [UIFont systemFontOfSize: [fontSize doubleValue]];
  }
  
  // MARK - textColor
  id textColorJson = [json objectForKey:@"textColor"];
  if (!textColorJson) {
    RCTLogWarn(@"JSON object is missing required key 'textColor'.");
    return nil;
  }
  UIColor *textColor = [RCTConvert UIColor:textColorJson];
  if (!textColor) {
    RCTLogWarn(@"Unable to convert 'textColor'. Provided value was '%@'", [RCTConvert NSString:textColorJson]);
    return nil;
  }
  
  // MARK - viewSize
  id viewSizeJson = [json objectForKey:@"viewSize"];
  if (!viewSizeJson) {
    RCTLogWarn(@"JSON object is missing required key 'viewSize'.");
    return nil;
  }
  CGSize viewSize = [RCTConvert CGSize:viewSizeJson];

  return [[CaptionExportStyle alloc] initWithWordStyle:wordStyle
                                lineStyle:lineStyle
                            textAlignment:textAlignment
                          backgroundStyle:backgroundStyle
                          backgroundColor:backgroundColor
                                     font:font
                                textColor:textColor
                                  viewSize:viewSize];
}
@end
