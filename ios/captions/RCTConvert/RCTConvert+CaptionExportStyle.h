#pragma once

#import "CaptionThis-Swift.h"
#import "React/RCTConvert.h"

@interface RCTConvert (CaptionExportStyle)
+ (nullable CaptionExportStyle*)CaptionExportStyle:(nonnull id)json;
@end
