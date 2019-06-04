#import "RCTConvert+CaptionLineStyle.h"

@implementation RCTConvert (CaptionLineStyle)

RCT_ENUM_CONVERTER(CaptionLineStyle, (@{
                     @"fadeInOut" : @(CaptionLineStyleFadeInOut),
                     @"translateY" : @(CaptionLineStyleTranslateY)
                   }),
                   CaptionLineStyleFadeInOut, integerValue)

@end
