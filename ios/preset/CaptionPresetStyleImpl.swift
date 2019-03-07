import Foundation

fileprivate let BAR_SPACE_HEIGHT = CGFloat(10)

enum CaptionPresetLayerKey {
  case a
  case b
  case c
}

class CaptionPresetStyleImpl {
  private struct Layers {
    let a = CALayer()
    let b = CALayer()
    let c = CALayer()

    public func get(byKey key: CaptionPresetLayerKey) -> CALayer {
      switch key {
      case .a:
        return a
      case .b:
        return b
      case .c:
        return c
      }
    }
  }

  private let layers = Layers()
  private let wordStyleImpl: CaptionPresetWordStyleImpl
  private let lineStyleImpl: CaptionPresetLineStyleImpl
  private let textAlignmentImpl: CaptionPresetTextAlignmentImpl
  private let backgroundStyleImpl: CaptionPresetBackgroundStyleImpl

  public var wordStyle: CaptionPresetWordStyle {
    return wordStyleImpl.wordStyle
  }

  public var lineStyle: CaptionPresetLineStyle {
    return lineStyleImpl.lineStyle
  }

  public var textAlignment: CaptionPresetTextAlignment {
    return textAlignmentImpl.textAlignment
  }

  public var backgroundStyle: CaptionPresetBackgroundStyle {
    return backgroundStyleImpl.backgroundStyle
  }

  public init(lineStyleImpl: CaptionPresetLineStyleImpl, textAlignmentImpl: CaptionPresetTextAlignmentImpl, wordStyleImpl: CaptionPresetWordStyleImpl, backgroundStyleImpl: CaptionPresetBackgroundStyleImpl) {
    self.lineStyleImpl = lineStyleImpl
    self.textAlignmentImpl = textAlignmentImpl
    self.wordStyleImpl = wordStyleImpl
    self.backgroundStyleImpl = backgroundStyleImpl
  }

  func setup(inParentLayer parentLayer: CALayer) {
    layers.a.opacity = 0
    layers.a.contentsScale = UIScreen.main.scale
    parentLayer.addSublayer(layers.a)
    layers.b.opacity = 0
    layers.b.contents = UIScreen.main.scale
    parentLayer.addSublayer(layers.b)
    layers.c.opacity = 0
    layers.c.contents = UIScreen.main.scale
    parentLayer.addSublayer(layers.c)
  }

  func resize(inParentLayer parentLayer: CALayer) {
    resize(key: .a, parentLayer: parentLayer)
    resize(key: .b, parentLayer: parentLayer)
    resize(key: .c, parentLayer: parentLayer)
  }

  private func resize(key: CaptionPresetLayerKey, parentLayer: CALayer) {
    let layer = layers.get(byKey: key)
    let origin = layerOrigin(forKey: key, parentLayer: parentLayer)
    let size = textAlignmentImpl.layerSize(forKey: key, parentLayer: parentLayer)
    layer.frame = CGRect(origin: origin, size: size)
    // TODO: rename lineStyleImpl.animate to applyLineStyle(key:layer:)
    layer.removeAllAnimations()
    let animation = lineStyleImpl.animate(key: key, layer: layer, parentLayer: parentLayer)
    layer.add(animation, forKey: "lineStyleAnimation")

    wordStyleImpl.applyWordStyle(key: key, layer: layer, textAlignment: textAlignment)
    backgroundStyleImpl.applyBackgroundStyle(layer: layer)
  }

  private func layerOrigin(forKey key: CaptionPresetLayerKey, parentLayer: CALayer) -> CGPoint {
    switch key {
    case .a:
      let layer = layers.get(byKey: .a)
      return topLayerOrigin(layer: layer, parentLayer: parentLayer)
    case .b:
      let layer = layers.get(byKey: .b)
      return bottomLayerOrigin(layer: layer, parentLayer: parentLayer)
    default:
      return hiddenLayerOrigin(parentLayer: parentLayer)
    }
  }

  private func topLayerOrigin(layer: CALayer, parentLayer: CALayer) -> CGPoint {
    let inFrameTopY = (parentLayer.frame.height - layer.frame.height - BAR_SPACE_HEIGHT) / 2
    return CGPoint(x: 0, y: inFrameTopY)
  }

  private func bottomLayerOrigin(layer: CALayer, parentLayer: CALayer) -> CGPoint {
    let inFrameBottomY = (parentLayer.frame.height - layer.frame.height + BAR_SPACE_HEIGHT) / 2
    return CGPoint(x: 0, y: inFrameBottomY)
  }

  private func hiddenLayerOrigin(parentLayer: CALayer) -> CGPoint {
    return CGPoint(x: 0, y: parentLayer.frame.height)
  }
}
