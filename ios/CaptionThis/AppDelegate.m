/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import "CaptionThis-Swift.h"
#import "RNNotifications.h"
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
  return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RNNotifications didRegisterUserNotificationSettings:notificationSettings];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification {
  [RNNotifications didReceiveRemoteNotification:notification];
}

// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNNotifications didReceiveLocalNotification:notification];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification
withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  NSLog( @"Handle push from foreground" );
  // custom code to handle push while app is in the foreground
  completionHandler(UNNotificationPresentationOptionAlert);
}

@end
