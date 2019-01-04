#import "CameraBridgeModule.h"
#import "AppDelegate.h"
#import "CaptionThis-Swift.h"
#import "Debug.h"
#import <Photos/Photos.h>
#import <React/RCTUtils.h>

@implementation CameraBridgeModule {
  bool hasListeners;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    CameraManager *cameraManager = [AppDelegate sharedCameraManager];
    cameraManager.delegate = self;
  }
  return self;
}

RCT_EXPORT_MODULE(Camera)

RCT_EXPORT_METHOD(startCameraPreview) {
  CameraManager *cameraManager = [AppDelegate sharedCameraManager];
  [cameraManager setupCameraCaptureSession];
  [cameraManager startPreview];
}

RCT_EXPORT_METHOD(startCameraCapture : (RCTResponseSenderBlock)callback) {
  [[AppDelegate sharedCameraManager]
      startCaptureWithCompletionHandler:^(NSError *error, BOOL success) {
        if (error != nil) {
          callback(@[ error, @(NO) ]);
          return;
        }
        callback(@[ [NSNull null], @(YES) ]);
      }];
}

RCT_EXPORT_METHOD(stopCameraCapture) {
  [[AppDelegate sharedCameraManager] stopCapture];
}

RCT_EXPORT_METHOD(switchToOppositeCamera) {
  [[AppDelegate sharedCameraManager] switchToOppositeCamera];
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"cameraManagerDidFinishFileOutput",
    @"cameraManagerDidFinishFileOutputWithError"
  ];
}

#pragma mark - CameraManagerDelegate

- (void)cameraManagerDidBeginFileOutputToFileURL:(NSURL *)fileURL {
  // unimplemented
}

- (void)cameraManagerDidFinishFileOutputToFileURL:(NSURL *)fileURL
                                            asset:(PHObjectPlaceholder *)asset
                                            error:(NSError *)error {
  if (!hasListeners) {
    return;
  }
  if (error) {
    [Debug logWithError:error];
    NSString *description = error.localizedDescription;
    NSDictionary<NSString *, id> *error = RCTMakeError(description, @{}, nil);
    [self sendEventWithName:@"cameraManagerDidFinishFileOutputWithError"
                       body:error];
    return;
  }
  if (!asset) {
    [Debug logWithMessage:
               @"CameraManager failed to create file asset in Photos library."];
    return;
  }
  NSDictionary *body = @{@"localIdentifier" : asset.localIdentifier};
  [self sendEventWithName:@"cameraManagerDidFinishFileOutput" body:body];
}

- (void)cameraManagerDidReceiveCameraDataOutputWithVideoData:
    (CMSampleBufferRef)videoData {
  // unimplemented
}

@end
