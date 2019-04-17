#import "RCTConvert+CaptionTextSegment.h"

@implementation RCTConvert (CaptionTextSegment)
  + (CaptionTextSegment*)CaptionTextSegment:(id)json {
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
    return [[CaptionTextSegment alloc] initWithText:text duration:[duration floatValue] timestamp:[timestamp floatValue]];
  }
@end
