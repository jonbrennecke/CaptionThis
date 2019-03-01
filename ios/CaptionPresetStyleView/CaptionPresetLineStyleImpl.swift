import Foundation

fileprivate let BAR_FADE_DURATION = CFTimeInterval(0.25)
fileprivate let BAR_TRANSLATE_DURATION = CFTimeInterval(1)

@objc
enum CaptionPresetLineStyle: Int {
  case fadeInOut
  case translateY
}

protocol CaptionPresetLineStyleImpl {
  var lineStyle: CaptionPresetLineStyle { get }
  func animate(key: CaptionPresetLayerKey, layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup
}

class CaptionPresetLineStyleFadeInOutImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .fadeInOut

  func animate(key: CaptionPresetLayerKey, layer _: CALayer, parentLayer _: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    let fadeInAnimation = AnimationUtil.fadeIn(at: 0, duration: 1)
    let fadeOutAnimation = AnimationUtil.fadeOut(at: 1.5, duration: 1)
    group.repeatCount = .greatestFiniteMagnitude
    group.duration = 3
    group.animations = [fadeInAnimation, fadeOutAnimation]
    return group
  }
}

class CaptionPresetLineStyleTranslateYImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .translateY

  func animate(key: CaptionPresetLayerKey, layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    switch key {
    case .a:
      return animateLineA(layer: layer, parentLayer: parentLayer)
    case .b:
      return animateLineB(layer: layer, parentLayer: parentLayer)
    case .c:
      return animateLineC(layer: layer, parentLayer: parentLayer)
    }
  }

  private func animateLineA(layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    group.animations = [
      AnimationUtil.fadeIn(at: BAR_FADE_DURATION, duration: BAR_FADE_DURATION),
      AnimationUtil.animatePosition(from: positions.outOfFrameBottomPosition, to: positions.inFrameMiddlePosition, at: 0, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameMiddlePosition, to: positions.inFrameTopPosition, at: 2, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition, at: 4, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.fadeOut(at: 4, duration: BAR_FADE_DURATION),
      AnimationUtil.fadeIn(at: 6 + BAR_FADE_DURATION, duration: BAR_FADE_DURATION),
      AnimationUtil.animatePosition(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition, at: 6, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition, at: 8, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition, at: 10, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.fadeOut(at: 10, duration: BAR_FADE_DURATION),
    ]
    group.duration = 16
    return group
  }

  private func animateLineB(layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    group.animations = [
      AnimationUtil.fadeIn(at: 2 + BAR_FADE_DURATION, duration: 1 + BAR_FADE_DURATION),
      AnimationUtil.animatePosition(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition, at: 2, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition, at: 4, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition, at: 6, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.fadeOut(at: 6, duration: BAR_FADE_DURATION),
      AnimationUtil.fadeIn(at: 8 + BAR_FADE_DURATION, duration: BAR_FADE_DURATION),
      AnimationUtil.animatePosition(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition, at: 8, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition, at: 10, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition, at: 12, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.fadeOut(at: 12, duration: BAR_FADE_DURATION),
    ]
    group.duration = 16
    return group
  }

  private func animateLineC(layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    group.animations = [
      AnimationUtil.fadeIn(at: 4 + BAR_FADE_DURATION, duration: BAR_FADE_DURATION),
      AnimationUtil.animatePosition(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition, at: 4, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition, at: 6, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition, at: 8, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.fadeOut(at: 8, duration: BAR_FADE_DURATION),
      AnimationUtil.fadeIn(at: 10 + BAR_FADE_DURATION, duration: BAR_FADE_DURATION),
      AnimationUtil.animatePosition(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition, at: 10, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition, at: 12, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.animatePosition(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition, at: 14, duration: BAR_TRANSLATE_DURATION),
      AnimationUtil.fadeOut(at: 14, duration: BAR_FADE_DURATION),
    ]
    group.duration = 16
    return group
  }
}
