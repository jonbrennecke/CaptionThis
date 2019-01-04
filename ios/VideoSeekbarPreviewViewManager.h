#pragma once

#import "VideoSeekbarPreviewView.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTViewManager.h>

@class VideoSeekbarPreviewViewManager;
@interface VideoSeekbarPreviewViewManager : RCTViewManager
- (void)generateImagesWithAsset:(AVAsset *)asset
                       withView:(VideoSeekbarPreviewView *)view;
@end
