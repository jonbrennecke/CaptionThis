#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTBridgeModule.h>

@interface VideoExportBridgeModule : NSObject <RCTBridgeModule>
@end

@interface VideoExportBridgeModule (Private)
- (NSArray<VideoAnimationBridgeTextSegmentParams *> *)convertTextSegments:(id)json;
@end
