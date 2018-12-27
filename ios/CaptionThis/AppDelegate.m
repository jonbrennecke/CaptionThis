/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import "CaptionThis-Swift.h"

@implementation AppDelegate

static CameraManager* _sharedCameraManager;
static SpeechManager* _sharedSpeechManager;
static PermissionsManager* _sharedPermissionsManager;

+ (CameraManager*)sharedCameraManager {
  if (_sharedCameraManager == nil) {
    _sharedCameraManager = [[CameraManager alloc] init];
  }
  return _sharedCameraManager;
}

+ (SpeechManager*)sharedSpeechManager {
  if (_sharedSpeechManager == nil) {
    _sharedSpeechManager = [[SpeechManager alloc] init];
  }
  return _sharedSpeechManager;
}

+ (PermissionsManager*)sharedPermissionsManager {
  if (_sharedPermissionsManager == nil) {
    _sharedPermissionsManager = [[PermissionsManager alloc] init];
  }
  return _sharedPermissionsManager;
}

+ (void)setSharedCameraManager:(CameraManager *)sharedCameraManager {
  _sharedCameraManager = sharedCameraManager;
}

+ (void)setSharedSpeechManager:(SpeechManager *)sharedSpeechManager {
  _sharedSpeechManager = sharedSpeechManager;
}

+ (void)setSharedPermissionsManager:(PermissionsManager *)sharedPermissionsManager {
  _sharedPermissionsManager = sharedPermissionsManager;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  return YES;
}

@end
