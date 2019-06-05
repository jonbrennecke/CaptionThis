#import "RCTConvert+CaptionBackgroundStyle.h"

@implementation RCTConvert (CaptionBackgroundStyle)

RCT_ENUM_CONVERTER(CaptionBackgroundStyle, (@{
                                              @"solid" : @(CaptionBackgroundStyleSolid),
                                              @"gradient" : @(CaptionBackgroundStyleGradient)
                                              }),
                   CaptionBackgroundStyleSolid, integerValue)

@end

