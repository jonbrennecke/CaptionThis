#pragma once

#import <React/RCTConvert.h>
#import <UIKit/UIKit.h>

@interface RCTConvert (UIImageOrientation)
+ (UIImageOrientation)UIImageOrientation:(id)json;
@end
