#pragma once

#import <UIKit/UIKit.h>
#import <React/RCTConvert.h>

@interface RCTConvert (UIImageOrientation)
+ (UIImageOrientation)UIImageOrientation:(id)json;
@end
