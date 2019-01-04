#pragma once

#import "CameraPreviewView.h"
#import <React/RCTViewManager.h>

@class CameraPreviewViewManager;
@interface CameraPreviewViewManager : RCTViewManager
@property(nonatomic, strong) CameraPreviewView *previewView;
@end
