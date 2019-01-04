#import "VideoExportBridgeModule.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"
#import <React/RCTConvert.h>
#import <Speech/Speech.h>

@implementation VideoExportBridgeModule

RCT_EXPORT_MODULE(VideoExport)

RCT_EXPORT_METHOD(exportVideo
                  : (NSDictionary<NSString *, id> *)params withCallback
                  : (RCTResponseSenderBlock)callback) {
  NSString *localIdentifier = [params objectForKey:@"video"];
  NSArray<NSDictionary *> *textSegmentsJson =
      [params objectForKey:@"textSegments"];
  NSDictionary<NSString *, id> *textColorJson =
      [params objectForKey:@"textColor"];
  UIColor *textColor = [RCTConvert UIColor:textColorJson];
  NSDictionary<NSString *, id> *backgroundColorJson =
      [params objectForKey:@"backgroundColor"];
  UIColor *backgroundColor = [RCTConvert UIColor:backgroundColorJson];
  NSString *fontFamily = [params objectForKey:@"fontFamily"];
  NSMutableArray<TextSegmentParams *> *textSegments =
      [[NSMutableArray alloc] initWithCapacity:textSegmentsJson.count];
  for (NSDictionary *json in textSegmentsJson) {
    NSString *text = [json objectForKey:@"text"];
    NSNumber *duration = [json objectForKey:@"duration"];
    NSNumber *timestamp = [json objectForKey:@"timestamp"];
    TextSegmentParams *params =
        [[TextSegmentParams alloc] initWithText:text
                                       duration:[duration floatValue]
                                      timestamp:[timestamp floatValue]];
    [textSegments addObject:params];
  }
  VideoAnimationParams *animationParams = [[VideoAnimationParams alloc] init];
  animationParams.textSegments = textSegments;
  animationParams.fontFamily = fontFamily;
  animationParams.backgroundColor = backgroundColor;
  animationParams.textColor = textColor;
  [AppDelegate.sharedVideoExportManager
      exportVideoWithLocalIdentifier:localIdentifier
                     animationParams:animationParams
                   completionHandler:^(NSError *_Nullable error, BOOL success) {
                     if (error != nil) {
                       callback(@[ error, @(NO) ]);
                       return;
                     }
                     callback(@[ [NSNull null], @(success) ]);
                   }];
}

@end
