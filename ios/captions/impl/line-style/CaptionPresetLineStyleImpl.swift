import Foundation

@objc
enum CaptionPresetLineStyle: Int {
  case fadeInOut
  case translateY
}

protocol CaptionPresetLineStyleImpl {
  var lineStyle: CaptionPresetLineStyle { get }
  func applyLineStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, parentLayer: CALayer, map: CaptionStringsMap, duration: CFTimeInterval)
}

class CaptionPresetLineStyleFadeInOutImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .fadeInOut

  func applyLineStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, parentLayer _: CALayer, map: CaptionStringsMap, duration: CFTimeInterval) {
    layer.removeAllAnimations()
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let builder = CaptionAnimation.Builder()
    let lines = map.getValues(byKey: key)!
    for (index, _) in lines.enumerated() {
      builder.insert(
        in: [FadeInAnimationStep()],
        center: [],
        out: [FadeOutAnimationStep()],
        index: index,
        key: key
      )
    }
    group.animations = builder.build(withMap: map)
    group.duration = duration
    layer.add(group, forKey: "lineStyleAnimation")
  }
}

class CaptionPresetLineStyleTranslateYImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .translateY

  func applyLineStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, parentLayer: CALayer, map: CaptionStringsMap, duration: CFTimeInterval) {
    layer.removeAllAnimations()
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    let builder = CaptionAnimation.Builder()
    let lines = map.getValues(byKey: key)!
    for (index, _) in lines.enumerated() {
      let outOfFrameBottom = positions.getPosition(forKey: .outOfFrameBottom)
      let inFrameTop = positions.getPosition(forKey: .inFrameTop)
      let outOfFrameTop = positions.getPosition(forKey: .outOfFrameTop)
      let inFrameBottomOrMiddle = positions.getPosition(forKey: index == 0 && key == .a ? .inFrameMiddle : .inFrameBottom)
      builder.insert(
        in: [
          FadeInAnimationStep(),
          PositionAnimationStep(from: outOfFrameBottom, to: inFrameBottomOrMiddle),
        ],
        center: [
          PositionAnimationStep(from: inFrameBottomOrMiddle, to: inFrameTop),
        ],
        out: [
          PositionAnimationStep(from: inFrameTop, to: outOfFrameTop),
          FadeOutAnimationStep(),
        ],
        index: index,
        key: key
      )
    }
    group.animations = builder.build(withMap: map)
    group.duration = duration
    layer.add(group, forKey: "lineStyleAnimation")
    layer.opacity = 0
  }
}
