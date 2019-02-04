#import <UIKit/UIKit.h>

#pragma once

@interface CameraPreviewView : UIView
@property(nonatomic, strong) CALayer *previewLayer;
-(void)setUp;
@end
