/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>

@class CameraManager;
@class SpeechManager;
@class PermissionsManager;
@class MediaLibraryManager;
@class VideoExportManager;

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) UIWindow *window;

@property (class) CameraManager *sharedCameraManager;
@property (class) SpeechManager *sharedSpeechManager;
@property (class) PermissionsManager *sharedPermissionsManager;
@property (class) MediaLibraryManager *sharedMediaLibraryManager;
@property (class) VideoExportManager *sharedVideoExportManager;

@end
