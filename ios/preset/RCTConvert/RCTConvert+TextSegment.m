#import "RCTConvert+TextSegment.h"

@implementation RCTConvert (TextSegment)
  + (TextSegment*)TextSegment:(id)json {
    NSDictionary *dict = [RCTConvert NSDictionary:json];
    if (!dict) {
      return nil;
    }
    NSString *text = [dict objectForKey:@"text"];
    NSNumber *duration = [dict objectForKey:@"duration"];
    NSNumber *timestamp = [dict objectForKey:@"timestamp"];
    if (!text || !duration || !timestamp) {
      return nil;
    }
    return [[TextSegment alloc] initWithText:text duration:[duration floatValue] timestamp:[timestamp floatValue]];
  }
@end
