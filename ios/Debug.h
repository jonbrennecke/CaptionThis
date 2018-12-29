#pragma once

#import <Foundation/Foundation.h>
#import "CaptionThis-Swift.h"

@interface Debug (ObjC)
+(void)logWithFormat:(NSString*)format, ... NS_REQUIRES_NIL_TERMINATION;
@end
