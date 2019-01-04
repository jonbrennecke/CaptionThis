#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CameraBridgeModule
    : RCTEventEmitter <RCTBridgeModule, CameraManagerDelegate>
- (void)cameraManagerDidBeginFileOutputToFileURL:(NSURL *)fileURL;
- (void)cameraManagerDidFinishFileOutputToFileURL:(NSURL *)fileURL
                                            asset:(PHObjectPlaceholder *)asset
                                            error:(NSError *)error;
- (void)cameraManagerDidReceiveCameraDataOutputWithVideoData:
    (CMSampleBufferRef)videoData;
@end
