#pragma once

#import <AVFoundation/AVFoundation.h>
#import <React/RCTViewManager.h>
#import "VideoSeekbarPreviewView.h"

@class VideoSeekbarPreviewViewManager;
@interface VideoSeekbarPreviewViewManager : RCTViewManager
- (void)generateImagesWithAsset:(AVAsset *)asset withView:(VideoSeekbarPreviewView*)view;
@end
