import Foundation

@objc
enum CaptionPresetLineStyle: Int {
  case fadeInOut
  case translateY
}

protocol CaptionPresetLineStyleImpl {
  var lineStyle: CaptionPresetLineStyle { get }
  func applyLineStyle(key: CaptionPresetLayerKey, layer: CALayer, parentLayer: CALayer)
}

class CaptionPresetLineStyleFadeInOutImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .fadeInOut

  func applyLineStyle(key: CaptionPresetLayerKey, layer: CALayer, parentLayer _: CALayer) {
    layer.removeAllAnimations()
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.duration = 3
    group.animations = CaptionAnimationBuilder()
      .insert(FadeInAnimationStep(), at: 0)
      .insert(FadeOutAnimationStep(), at: 1)
      .build()
    layer.add(group, forKey: "lineStyleAnimation")
  }
}

class CaptionPresetLineStyleTranslateYImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .translateY

  func applyLineStyle(key: CaptionPresetLayerKey, layer: CALayer, parentLayer: CALayer) {
    layer.removeAllAnimations()
    let group = createAnimation(key: key, layer: layer, parentLayer: parentLayer)
    layer.add(group, forKey: "lineStyleAnimation")
  }

  private func createAnimation(key: CaptionPresetLayerKey, layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
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
    group.animations = CaptionAnimationBuilder()
      .insert([
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameMiddlePosition),
      ], at: 0)
      .insert(PositionAnimationStep(from: positions.inFrameMiddlePosition, to: positions.inFrameTopPosition), at: 1)
      .insert([
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ], at: 2)
      .insert([
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ], at: 3)
      .insert(PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition), at: 4)
      .insert([
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ], at: 5)
      .build()
    group.duration = 16
    return group
  }

  private func animateLineB(layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    group.animations = CaptionAnimationBuilder()
      .insert([
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ], at: 1)
      .insert(PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition), at: 2)
      .insert([
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ], at: 3)
      .insert([
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ], at: 4)
      .insert(PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition), at: 5)
      .insert([
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ], at: 6)
      .build()
    group.duration = 16
    return group
  }

  private func animateLineC(layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    group.animations = CaptionAnimationBuilder()
      .insert([
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ], at: 2)
      .insert([
        PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition),
      ], at: 3)
      .insert([
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ], at: 4)
      .insert([
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ], at: 5)
      .insert([
        PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameMiddlePosition),
      ], at: 6)
      .insert([
        PositionAnimationStep(from: positions.inFrameMiddlePosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ], at: 7)
      .build()
    group.duration = 16
    return group
  }
}
