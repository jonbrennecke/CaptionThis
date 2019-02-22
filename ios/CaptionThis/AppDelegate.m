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
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif
#import <ReactNativeNavigation/ReactNativeNavigation.h>

@implementation AppDelegate

static SpeechManager *_sharedSpeechManager;
static PermissionsManager *_sharedPermissionsManager;
static MediaLibraryManager *_sharedMediaLibraryManager;

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
