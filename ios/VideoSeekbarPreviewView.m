#import "VideoSeekbarPreviewView.h"

@implementation VideoSeekbarPreviewView

- (instancetype)init {
  self = [super init];
  if (self) {
    NSMutableArray<UIImageView *> *imageViews = [[NSMutableArray alloc]
        initWithCapacity:SEEKBAR_NUMBER_OF_PREVIEW_FRAMES];
    for (size_t i = 0; i < SEEKBAR_NUMBER_OF_PREVIEW_FRAMES; i++) {
      UIImageView *imageView = [[UIImageView alloc] init];
      imageView.layer.masksToBounds = YES;
      [imageViews addObject:imageView];
      [self addSubview:imageView];
    }
    self.imageViews = imageViews;
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  CGFloat width = self.bounds.size.width / self.imageViews.count;
  CGFloat height = self.bounds.size.height;
  for (size_t i = 0; i < self.imageViews.count; i++) {
    UIImageView *imageView = [self.imageViews objectAtIndex:i];
    imageView.frame = CGRectMake(width * i, 0, width, height);
  }
}

- (void)setImage:(UIImage *)image atIndex:(NSUInteger)index {
  if (index >= self.imageViews.count) {
    return;
  }
  UIImageView *imageView = [self.imageViews objectAtIndex:index];
  if (!imageView) {
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    imageView.image = image;
    switch (image.imageOrientation) {
    case UIImageOrientationLeft:
    case UIImageOrientationRight:
      imageView.contentMode = UIViewContentModeScaleAspectFit;
      break;
    default:
      imageView.contentMode = UIViewContentModeScaleAspectFill;
      break;
    }
  });
}

@end
