#import "RCTConvert+CaptionBackgroundStyle.h"

@implementation RCTConvert (CaptionBackgroundStyle)

RCT_ENUM_CONVERTER(CaptionBackgroundStyle, (@{
                                              @"solid" : @(CaptionBackgroundStyleSolid),
                                              @"gradient" : @(CaptionBackgroundStyleGradient),
                                              @"textBoundingBox" : @(CaptionBackgroundStyleTextBoundingBox)
                                              }),
                   CaptionBackgroundStyleSolid, integerValue)

@end

