#import "CameraPreviewViewManager.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTUIManager.h>

@implementation CameraPreviewViewManager

RCT_EXPORT_MODULE(CameraPreviewManager)

RCT_EXPORT_METHOD(focusOnPoint
                  : (nonnull NSNumber *)reactTag focusPoint
                  : (id)pointJson) {
  CGPoint point = [RCTConvert CGPoint:pointJson];
  CameraManager *cameraManager = [AppDelegate sharedCameraManager];
  [cameraManager focusOnPoint:point];
}

RCT_EXPORT_METHOD(setUp: (nonnull NSNumber *)reactTag) {
  [self.bridge.uiManager
   addUIBlock:^(RCTUIManager *uiManager,
                NSDictionary<NSNumber *, UIView *> *viewRegistry) {
     CameraPreviewView *view = (CameraPreviewView*)viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[CameraPreviewView class]]) {
       RCTLogError(@"Cannot find CameraPreviewView with tag #%@", reactTag);
       return;
     }
     dispatch_async(dispatch_get_main_queue(), ^{
       [view setUp];
     });
   }];
}

- (UIView *)view {
  CameraPreviewView *previewView = [[CameraPreviewView alloc] init];
  return (UIView *)previewView;
}

@end
