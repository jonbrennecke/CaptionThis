#pragma once

#import "CaptionThis-Swift.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface MediaLibraryBridgeModule
    : RCTEventEmitter <RCTBridgeModule, MediaLibraryManagerDelegate>
- (void)mediaLibraryManagerDidOutputThumbnail:(UIImage *)thumbnail
                                forTargetSize:(CGSize)size;
@end
