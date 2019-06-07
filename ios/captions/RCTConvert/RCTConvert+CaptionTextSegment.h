#pragma once

#import "CaptionThis-Swift.h"
#import "React/RCTConvert.h"

@interface RCTConvert (CaptionTextSegment)
+ (CaptionTextSegment*)CaptionTextSegment:(id)json;
@end
