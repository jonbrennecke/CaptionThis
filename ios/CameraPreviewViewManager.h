#pragma once

#import <React/RCTViewManager.h>
#import "CameraPreviewView.h"

@class CameraPreviewViewManager;
@interface CameraPreviewViewManager: RCTViewManager
@property(nonatomic, strong) CameraPreviewView* previewView;
@end
