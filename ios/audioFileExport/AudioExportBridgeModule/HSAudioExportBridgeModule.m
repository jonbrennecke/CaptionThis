#import <Foundation/Foundation.h>
#import <React/RCTUtils.h>

#import "HSAudioExportBridgeModule.h"
#import "CaptionThis-Swift.h"

@implementation HSAudioExportBridgeModule

RCT_EXPORT_MODULE(HSAudioExportBridgeModule)

RCT_EXPORT_METHOD(createAudioFile:(NSString*)assetID callback:(RCTResponseSenderBlock)callback) {
  [HSAudioExportManager createAudioFileFromAssetID:assetID completionHandler:
   ^(NSError * _Nullable error, NSURL * _Nullable audioFileURL) {
    if (error) {
      id jsError = RCTJSErrorFromNSError(error);
      callback(@[ jsError, [NSNull null] ]);
      return;
    }
    callback(@[ [NSNull null], audioFileURL.absoluteString ]);
  }];
}

@end
