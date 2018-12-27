#pragma once

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "CaptionThis-Swift.h"

@interface MediaLibraryBridgeModule : RCTEventEmitter<RCTBridgeModule, MediaLibraryManagerDelegate>
-(void)mediaLibraryManagerDidOutputThumbnail:(UIImage *)thumbnail forTargetSize:(CGSize)size;
@end
