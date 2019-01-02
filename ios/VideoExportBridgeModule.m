#import <Speech/Speech.h>
#import "VideoExportBridgeModule.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"

@implementation VideoExportBridgeModule

RCT_EXPORT_MODULE(VideoExport)

RCT_EXPORT_METHOD(exportVideo:(NSString*)localIdentifier
                  withTextOverlayParams:(NSArray<NSDictionary*>*)jsonParamsArray
                  withCallback:(RCTResponseSenderBlock)callback) {
  NSMutableArray<TextOverlayParams*>* paramsArray = [[NSMutableArray alloc] initWithCapacity:jsonParamsArray.count];
  for (NSDictionary* jsonParams in jsonParamsArray) {
    NSString* text = [jsonParams objectForKey:@"text"];
    NSNumber* duration = [jsonParams objectForKey:@"duration"];
    NSNumber* timestamp = [jsonParams objectForKey:@"timestamp"];
    // TODO: check text, duration and timestamp for nil or [NSNull null] values
    TextOverlayParams* params = [[TextOverlayParams alloc] initWithText:text duration:[duration floatValue] timestamp:[timestamp floatValue]];
    [paramsArray addObject:params];
  }
  [AppDelegate.sharedVideoExportManager
   exportVideoWithLocalIdentifier:localIdentifier
   paramsArray:paramsArray
   completionHandler:^(NSError * _Nullable error, BOOL success) {
     if (error != nil) {
       callback(@[error, @(NO)]);
       return;
     }
     callback(@[[NSNull null], @(success)]);
   }];
}

@end
