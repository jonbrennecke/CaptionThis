import AVFoundation

// NOTE: animations in Core Animation cannot be shorter than 0.25
fileprivate let MINIMUM_ANIMATION_DURATION = CFTimeInterval(0.25)
fileprivate let DEFAULT_ANIMATION_DURATION = CFTimeInterval(0.25)

class AnimationUtil {
  public static func animatePosition(
    from fromPoint: CGPoint,
    to toPoint: CGPoint,
    at beginTime: CFTimeInterval,
    duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION
  ) -> CABasicAnimation {
    let animation = CABasicAnimation(keyPath: #keyPath(CALayer.position))
    animation.fromValue = fromPoint
    animation.toValue = toPoint
    animation.fillMode = .forwards
    animation.isRemovedOnCompletion = false
    if duration < MINIMUM_ANIMATION_DURATION {
      animation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime - duration
      animation.duration = MINIMUM_ANIMATION_DURATION
    } else {
      animation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
      animation.duration = duration
    }
    animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    return animation
  }

  public static func fadeIn(
    at beginTime: CFTimeInterval,
    duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION
  ) -> CABasicAnimation {
    return animateOpacity(from: 0, to: 1, at: beginTime, duration: duration)
  }

  public static func fadeOut(
    at beginTime: CFTimeInterval,
    duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION
  ) -> CABasicAnimation {
    return animateOpacity(from: 1, to: 0, at: beginTime, duration: duration)
  }

  public static func animateOpacity(
    from fromOpacity: CGFloat,
    to toOpacity: CGFloat,
    at beginTime: CFTimeInterval,
    duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION
  ) -> CABasicAnimation {
    let animation = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    animation.fromValue = fromOpacity
    animation.toValue = toOpacity
    animation.fillMode = .forwards
    animation.isRemovedOnCompletion = false
    animation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    animation.duration = duration
    animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    return animation
  }

  public static func animateBounds(
    from fromBounds: CGRect,
    to toBounds: CGRect,
    at beginTime: CFTimeInterval,
    duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION
  ) -> CABasicAnimation {
    let animation = CABasicAnimation(keyPath: #keyPath(CALayer.bounds))
    animation.fromValue = fromBounds
    animation.toValue = toBounds
    animation.fillMode = .forwards
    animation.isRemovedOnCompletion = false
    animation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    animation.duration = duration
    animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    return animation
  }
}
