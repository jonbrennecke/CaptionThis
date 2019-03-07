#import "RCTConvert+CaptionPresetTextAlignment.h"

@implementation RCTConvert (CaptionPresetTextAlignment)

RCT_ENUM_CONVERTER(CaptionPresetTextAlignment, (@{
                     @"left" : @(CaptionPresetTextAlignmentLeft),
                     @"right" : @(CaptionPresetTextAlignmentRight),
                     @"center" : @(CaptionPresetTextAlignmentCenter),
                   }),
                   CaptionPresetTextAlignmentLeft, integerValue)

@end
