#pragma once

#import <React/RCTViewManager.h>
#import "CaptionThis-Swift.h"

@class VideoPlayerViewWrap;
@interface VideoPlayerViewWrap : UIView<VideoPlayerViewDelegate>
@property (nonatomic, retain) VideoPlayerView *playerView;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoDidBecomeReadyToPlay;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoDidFailToLoad;
- (void)videoPlayerDidFailToLoad;
- (void)videoPlayerDidBecomeReadyToPlayAsset:(AVAsset*)asset;
@end

@class VideoPlayerViewManager;
@interface VideoPlayerViewManager : RCTViewManager
@end
