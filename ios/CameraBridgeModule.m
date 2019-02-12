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
    CameraManager.sharedInstance.delegate = self;
  }
  return self;
}

RCT_EXPORT_MODULE(Camera)

RCT_EXPORT_METHOD(startCameraPreview) {
  CameraManager *cameraManager = CameraManager.sharedInstance;
  [cameraManager setupCameraCaptureSession];
  [cameraManager startPreview];
}

RCT_EXPORT_METHOD(stopCameraPreview) {
  CameraManager *cameraManager = CameraManager.sharedInstance;
  [cameraManager stopPreview];
}

RCT_EXPORT_METHOD(startCameraCapture : (RCTResponseSenderBlock)callback) {
  [CameraManager.sharedInstance
      startCaptureWithCompletionHandler:^(NSError *error, BOOL success) {
        if (error != nil) {
          callback(@[ error, @(NO) ]);
          return;
        }
        callback(@[ [NSNull null], @(YES) ]);
      }];
}

RCT_EXPORT_METHOD(stopCameraCapture) {
  [CameraManager.sharedInstance stopCapture];
}

RCT_EXPORT_METHOD(switchToOppositeCamera) {
  [CameraManager.sharedInstance switchToOppositeCamera];
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
  AVURLAsset *avasset = [[AVURLAsset alloc] initWithURL:fileURL options:nil];
  CMTime duration = avasset.duration;
  NSDictionary *body = @{
    @"id" : asset.localIdentifier,
    @"duration" : @(CMTimeGetSeconds(duration))
  };
  [self sendEventWithName:@"cameraManagerDidFinishFileOutput" body:body];
}

- (void)cameraManagerDidReceiveCameraDataOutputWithVideoData:
    (CMSampleBufferRef)videoData {
  // unimplemented
}

@end
