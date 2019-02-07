/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import "CaptionThis-Swift.h"
#import "RNSplashScreen.h"
#import <Crashlytics/Crashlytics.h>
#import <Fabric/Fabric.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>

@implementation AppDelegate

static CameraManager *_sharedCameraManager;
static SpeechManager *_sharedSpeechManager;
static PermissionsManager *_sharedPermissionsManager;
static MediaLibraryManager *_sharedMediaLibraryManager;
static VideoExportManager *_sharedVideoExportManager;

+ (CameraManager *)sharedCameraManager {
  if (_sharedCameraManager == nil) {
    _sharedCameraManager = [[CameraManager alloc] init];
  }
  return _sharedCameraManager;
}

+ (SpeechManager *)sharedSpeechManager {
  if (_sharedSpeechManager == nil) {
    _sharedSpeechManager = [[SpeechManager alloc] init];
  }
  return _sharedSpeechManager;
}

+ (PermissionsManager *)sharedPermissionsManager {
  if (_sharedPermissionsManager == nil) {
    _sharedPermissionsManager = [[PermissionsManager alloc] init];
  }
  return _sharedPermissionsManager;
}

+ (MediaLibraryManager *)sharedMediaLibraryManager {
  if (_sharedMediaLibraryManager == nil) {
    _sharedMediaLibraryManager = [[MediaLibraryManager alloc] init];
  }
  return _sharedMediaLibraryManager;
}

+ (VideoExportManager *)sharedVideoExportManager {
  if (_sharedVideoExportManager == nil) {
    _sharedVideoExportManager = [[VideoExportManager alloc] init];
  }
  return _sharedVideoExportManager;
}

+ (void)setSharedCameraManager:(CameraManager *)sharedCameraManager {
  _sharedCameraManager = sharedCameraManager;
}

+ (void)setSharedSpeechManager:(SpeechManager *)sharedSpeechManager {
  _sharedSpeechManager = sharedSpeechManager;
}

+ (void)setSharedPermissionsManager:
    (PermissionsManager *)sharedPermissionsManager {
  _sharedPermissionsManager = sharedPermissionsManager;
}

+ (void)setSharedMediaLibraryManager:
    (MediaLibraryManager *)sharedMediaLibraryManager {
  _sharedMediaLibraryManager = sharedMediaLibraryManager;
}

+ (void)setSharedVideoExportManager:
    (VideoExportManager *)sharedVideoExportManager {
  _sharedVideoExportManager = sharedVideoExportManager;
}

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [Fabric with:@[ [Crashlytics class] ]];

  NSURL *jsCodeLocation;

#ifdef DEBUG
  jsCodeLocation =
      [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"
                                                     fallbackResource:nil];
#else
  jsCodeLocation =
      [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  [RNSplashScreen show];
  return YES;
}

@end
