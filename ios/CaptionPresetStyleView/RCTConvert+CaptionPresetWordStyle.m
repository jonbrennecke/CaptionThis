#import "RCTConvert+CaptionPresetWordStyle.h"

@implementation RCTConvert (CaptionPresetWordStyle)

RCT_ENUM_CONVERTER(CaptionPresetWordStyle, (@{
                     @"animated" : @(CaptionPresetWordStyleAnimated),
                     @"none" : @(CaptionPresetWordStyleNone)
                   }),
                   CaptionPresetWordStyleAnimated, integerValue)

@end
