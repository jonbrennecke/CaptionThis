#pragma once

#import "CaptionThis-Swift.h"
#import "React/RCTConvert.h"

@interface RCTConvert (TextSegment)
+ (TextSegment*)TextSegment:(id)json;
@end
