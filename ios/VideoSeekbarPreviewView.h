#pragma once

#import <UIKit/UIKit.h>

#define SEEKBAR_NUMBER_OF_PREVIEW_FRAMES 10

@interface VideoSeekbarPreviewView : UIView
@property (nonatomic, retain) NSArray<UIImageView*>* imageViews;
-(void)setImage:(UIImage*)image atIndex:(NSUInteger)index;
@end
