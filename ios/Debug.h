#pragma once

#import "CaptionThis-Swift.h"
#import <Foundation/Foundation.h>

@interface Debug (ObjC)
+ (void)logWithFormat:(NSString *)format, ... NS_REQUIRES_NIL_TERMINATION;
@end
