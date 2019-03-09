import Foundation

@objc
enum CaptionPresetLineStyle: Int {
  case fadeInOut
  case translateY
}

protocol CaptionPresetLineStyleImpl {
  var lineStyle: CaptionPresetLineStyle { get }
  func applyLineStyle(key: CaptionPresetLayerKey, layer: CALayer, parentLayer: CALayer, strings: [NSAttributedString], duration: CFTimeInterval)
}

class CaptionPresetLineStyleFadeInOutImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .fadeInOut

  func applyLineStyle(key: CaptionPresetLayerKey, layer: CALayer, parentLayer _: CALayer, strings: [NSAttributedString], duration: CFTimeInterval) {
    layer.removeAllAnimations()
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.duration = duration
    group.animations = CaptionAnimationBuilder()
      .insert(FadeInAnimationStep(), at: 0)
      .insert(FadeOutAnimationStep(), at: 1)
      .build()
    layer.add(group, forKey: "lineStyleAnimation")
  }
}

class CaptionPresetLineStyleTranslateYImpl: CaptionPresetLineStyleImpl {
  public let lineStyle: CaptionPresetLineStyle = .translateY

  func applyLineStyle(key: CaptionPresetLayerKey, layer: CALayer, parentLayer: CALayer, strings: [NSAttributedString], duration: CFTimeInterval) {
    layer.removeAllAnimations()
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
    var builder = CaptionAnimationBuilder()
    let offset = additionalAnimationIndexOffset(key: key)
    for (index, _) in strings.enumerated() {
      let startIndex = 6 * index + offset
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

  // TODO: make this reusable
  private func additionalAnimationIndexOffset(key: CaptionPresetLayerKey) -> Int {
    switch key {
    case .a:
      return 0
    case .b:
      return 1
    case .c:
      return 2
    }
  }
}
