#import "RCTConvert+CaptionTextAlignment.h"

@implementation RCTConvert (CaptionTextAlignment)

RCT_ENUM_CONVERTER(CaptionTextAlignment, (@{
                     @"left" : @(CaptionTextAlignmentLeft),
                     @"right" : @(CaptionTextAlignmentRight),
                     @"center" : @(CaptionTextAlignmentCenter),
                   }),
                   CaptionTextAlignmentLeft, integerValue)

@end
