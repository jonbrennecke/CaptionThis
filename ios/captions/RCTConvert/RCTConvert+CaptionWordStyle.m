#import "RCTConvert+CaptionWordStyle.h"

@implementation RCTConvert (CaptionWordStyle)

RCT_ENUM_CONVERTER(CaptionWordStyle, (@{
                     @"animated" : @(CaptionWordStyleAnimated),
                     @"none" : @(CaptionWordStyleNone)
                   }),
                   CaptionWordStyleAnimated, integerValue)

@end
