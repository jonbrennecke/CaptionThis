#pragma once

#import "CaptionThis-Swift.h"
#import "React/RCTConvert.h"

@interface RCTConvert (CaptionViewLayout)
+ (nullable CaptionViewLayout*)CaptionViewLayout:(nonnull id)json;
@end
