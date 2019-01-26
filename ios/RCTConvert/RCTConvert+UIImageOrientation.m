#import "RCTConvert+UIImageOrientation.h"

@implementation RCTConvert (UIImageOrientation)

RCT_ENUM_CONVERTER(UIImageOrientation, (@{
                                          @"up": @(UIImageOrientationUp),
                                          @"upMirrored": @(UIImageOrientationUpMirrored),
                                          @"down": @(UIImageOrientationDown),
                                          @"downMirrored": @(UIImageOrientationDownMirrored),
                                          @"left": @(UIImageOrientationLeft),
                                          @"leftMirrored": @(UIImageOrientationLeftMirrored),
                                          @"right": @(UIImageOrientationRight),
                                          @"rightMirrored": @(UIImageOrientationRightMirrored),
                                          }), UIImageOrientationUp, integerValue)

@end
