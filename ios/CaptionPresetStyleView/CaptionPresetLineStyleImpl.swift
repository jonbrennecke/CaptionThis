import Foundation

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
    group.repeatCount = .greatestFiniteMagnitude
    group.duration = 3
    group.animations = AnimationListBuilder()
      .add(steps: [FadeInAnimationStep()])
      .add(steps: [FadeOutAnimationStep()])
      .build()
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
    group.animations = AnimationListBuilder()
      .add(steps: [
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameMiddlePosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameMiddlePosition, to: positions.inFrameTopPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ])
      .add(steps: [
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ])
      .build()
    group.duration = 16
    return group
  }

  private func animateLineB(layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    group.animations = AnimationListBuilder()
      .add(steps: [])
      .add(steps: [
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ])
      .add(steps: [
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ])
      .build()
    group.duration = 16
    return group
  }

  private func animateLineC(layer: CALayer, parentLayer: CALayer) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    group.animations = AnimationListBuilder()
      .add(steps: [])
      .add(steps: [])
      .add(steps: [
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameTopPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameTopPosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ])
      .add(steps: [
        FadeInAnimationStep(),
        PositionAnimationStep(from: positions.outOfFrameBottomPosition, to: positions.inFrameBottomPosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameBottomPosition, to: positions.inFrameMiddlePosition),
      ])
      .add(steps: [
        PositionAnimationStep(from: positions.inFrameMiddlePosition, to: positions.outOfFrameTopPosition),
        FadeOutAnimationStep(),
      ])
      .build()
    group.duration = 16
    return group
  }
}
