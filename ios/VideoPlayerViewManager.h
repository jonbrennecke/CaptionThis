#pragma once

#import <React/RCTViewManager.h>
#import "CaptionThis-Swift.h"

@class VideoPlayerViewWrap;
@interface VideoPlayerViewWrap : UIView<VideoPlayerViewDelegate>
@property (nonatomic, retain) VideoPlayerView *playerView;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoDidBecomeReadyToPlay;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoDidFailToLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoDidPause;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoDidUpdatePlaybackTime;
- (void)videoPlayerDidFailToLoad;
- (void)videoPlayerDidBecomeReadyToPlayAsset:(AVAsset*)asset;
- (void)videoPlayerDidPause;
- (void)videoPlayerDidUpdatePlaybackTime:(CMTime)time duration:(CMTime)duration;
@end

@class VideoPlayerViewManager;
@interface VideoPlayerViewManager : RCTViewManager
@end
