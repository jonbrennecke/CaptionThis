#import "RCTConvert+CaptionPresetBackgroundStyle.h"

@implementation RCTConvert (CaptionPresetBackgroundStyle)

RCT_ENUM_CONVERTER(CaptionPresetBackgroundStyle, (@{
                                              @"solid" : @(CaptionPresetBackgroundStyleSolid),
                                              @"gradient" : @(CaptionPresetBackgroundStyleSolid)
                                              }),
                   CaptionPresetBackgroundStyleSolid, integerValue)

@end

