#import "RCTConvert+CaptionPresetLineStyle.h"

@implementation RCTConvert (CaptionPresetLineStyle)

RCT_ENUM_CONVERTER(CaptionPresetLineStyle, (@{
                     @"fadeInOut" : @(CaptionPresetLineStyleFadeInOut),
                     @"translateY" : @(CaptionPresetLineStyleTranslateY)
                   }),
                   CaptionPresetLineStyleFadeInOut, integerValue)

@end
