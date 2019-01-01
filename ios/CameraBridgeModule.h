#pragma once

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "CaptionThis-Swift.h"

@interface CameraBridgeModule : RCTEventEmitter<RCTBridgeModule, CameraManagerDelegate>
- (void)cameraManagerDidBeginFileOutputToFileURL:(NSURL *)fileURL;
- (void)cameraManagerDidFinishFileOutputToFileURL:(NSURL *)fileURL asset:(PHObjectPlaceholder *)asset error:(NSError *)error;
- (void)cameraManagerDidReceiveCameraDataOutputWithVideoData:(CMSampleBufferRef)videoData;
@end
