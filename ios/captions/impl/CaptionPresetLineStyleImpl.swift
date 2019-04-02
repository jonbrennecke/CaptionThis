import Foundation

@objc
enum CaptionPresetLineStyle: Int {
  case fadeInOut
  case translateY
}

protocol CaptionPresetLineStyleImpl {
  var lineStyle: CaptionPresetLineStyle { get }
  func applyLineStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, parentLayer: CALayer, strings: CaptionStringsMap.Value, duration: CFTimeInterval)
}

class CaptionPresetLineStyleFadeInOutImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .fadeInOut

  func applyLineStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, parentLayer _: CALayer, strings: CaptionStringsMap.Value, duration: CFTimeInterval) {
    layer.removeAllAnimations()
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    var builder = CaptionAnimationBuilder()
    for (index, _) in strings.enumerated() {
      let startIndex = (index * 3)
      builder = builder
        .insert([
          FadeInAnimationStep(),
        ], at: startIndex)
        .insert([
          FadeOutAnimationStep(),
        ], at: 2 + startIndex)
    }
    group.animations = builder.build()
    group.duration = duration
    layer.add(group, forKey: "lineStyleAnimation")
  }
}

class CaptionPresetLineStyleTranslateYImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .translateY

  func applyLineStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, parentLayer: CALayer, strings: CaptionStringsMap.Value, duration: CFTimeInterval) {
    layer.removeAllAnimations()
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    var builder = CaptionAnimationBuilder()
    for (index, _) in strings.enumerated() {
      let startIndex = (index * 3) + key.index
      let outOfFrameBottom = positions.getPosition(forKey: .outOfFrameBottom)
      let inFrameTop = positions.getPosition(forKey: .inFrameTop)
      let outOfFrameTop = positions.getPosition(forKey: .outOfFrameTop)
      let inFrameBottomOrMiddle = positions.getPosition(forKey: index == 0 && key == .a ? .inFrameMiddle : .inFrameBottom)
      builder = builder
        .insert([
          FadeInAnimationStep(),
          PositionAnimationStep(from: outOfFrameBottom, to: inFrameBottomOrMiddle),
        ], at: startIndex)
        .insert(PositionAnimationStep(from: inFrameBottomOrMiddle, to: inFrameTop), at: 1 + startIndex)
        .insert([
          PositionAnimationStep(from: inFrameTop, to: outOfFrameTop),
          FadeOutAnimationStep(),
        ], at: 2 + startIndex)
    }
    group.animations = builder.build()
    group.duration = duration
    layer.add(group, forKey: "lineStyleAnimation")
  }
}
