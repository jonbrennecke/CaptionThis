#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface VideoExportBridgeModule : RCTEventEmitter <RCTBridgeModule>
@end

@interface VideoExportBridgeModule (Private)
- (NSArray<VideoAnimationBridgeTextSegmentParams *> *)convertTextSegments:
    (id)json;
@end

@interface VideoExportBridgeModule (
    VideoExportManagerDelegate) <VideoExportManagerDelegate>
- (void)videoExportManagerDidFinishWithObjectPlaceholder:(PHObjectPlaceholder *)objectPlaceholder;
- (void)videoExportManagerDidFailWithError:(NSError *)error;
@end
