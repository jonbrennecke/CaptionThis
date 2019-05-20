#import "RCTConvert+CaptionViewLayout.h"

@implementation RCTConvert (CaptionViewLayout)
+ (CaptionViewLayout*)CaptionViewLayout:(id)json {
  NSDictionary *dict = [RCTConvert NSDictionary:json];
  if (!dict) {
    return nil;
  }
  return [[CaptionViewLayout alloc] initWithNsDict:dict];
}
@end
