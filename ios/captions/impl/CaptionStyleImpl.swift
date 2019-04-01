import UIKit

fileprivate let BAR_SPACE_HEIGHT_FACTOR = CGFloat(1.25)

class CaptionStyleImpl {
  
  public enum LayerKey {
    case a
    case b
    case c
    
    public var index: Int {
      get {
        switch self {
        case .a:
          return 0
        case .b:
          return 1
        case .c:
          return 2
        }
      }
    }
  }
  
  private struct Layers {
    let a = CALayer()
    let b = CALayer()
    let c = CALayer()

    public func get(byKey key: LayerKey) -> CALayer {
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
  private let textSegments: [TextSegment]
  private let style: CaptionPresetStyle
  private let duration: CFTimeInterval

  public init(
    lineStyleImpl: CaptionPresetLineStyleImpl,
    textAlignmentImpl: CaptionPresetTextAlignmentImpl,
    wordStyleImpl: CaptionPresetWordStyleImpl,
    backgroundStyleImpl: CaptionPresetBackgroundStyleImpl,
    textSegments: [TextSegment],
    style: CaptionPresetStyle,
    duration: CFTimeInterval
  ) {
    self.lineStyleImpl = lineStyleImpl
    self.textAlignmentImpl = textAlignmentImpl
    self.wordStyleImpl = wordStyleImpl
    self.backgroundStyleImpl = backgroundStyleImpl
    self.textSegments = textSegments
    self.style = style
    self.duration = duration
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
    let layerASize = resize(key: .a, parentLayer: parentLayer)
    let layerBSize = resize(key: .b, parentLayer: parentLayer)
    let layerCSize = resize(key: .c, parentLayer: parentLayer)
    let layerSizes: [LayerKey: CGSize] = [.a: layerASize, .b: layerBSize, .c: layerCSize]
    let layout = VideoAnimationLayerLayout.layoutForView(orientation: .up, style: style)
    let layerStrings = CaptionTextUtil.fitText(layerSizes: layerSizes, textSegments: textSegments, style: style, layout: layout)
    let keys = CaptionStyleImpl.listKeys(forLineStyle: style.lineStyle)
    for key in keys {
      guard let strings = layerStrings[key] else {
        return
      }
      applyStyles(key: key, parentLayer: parentLayer, strings: strings, layout: layout)
    }
  }

  private static func listKeys(forLineStyle lineStyle: CaptionPresetLineStyle) -> [LayerKey] {
    switch lineStyle {
    case .fadeInOut:
      return [.a, .b]
    case .translateY:
      return [.a, .b, .c]
    }
  }

  private func resize(key: LayerKey, parentLayer: CALayer) -> CGSize {
    let layer = layers.get(byKey: key)
    let origin = layerOrigin(forKey: key, parentLayer: parentLayer)
    let size = textAlignmentImpl.layerSize(forKey: key, parentLayer: parentLayer, fontSize: style.font.lineHeight)
    layer.frame = CGRect(origin: origin, size: size)
    return size
  }

  private func applyStyles(key: LayerKey, parentLayer: CALayer, strings: [NSAttributedString], layout: VideoAnimationLayerLayout) {
    let layer = layers.get(byKey: key)
    lineStyleImpl.applyLineStyle(key: key, layer: layer, parentLayer: parentLayer, strings: strings, duration: duration)
    wordStyleImpl.applyWordStyle(key: key, layer: layer, textAlignment: style.textAlignment, strings: strings, layout: layout, duration: duration)
    backgroundStyleImpl.applyBackgroundStyle(parentLayer: parentLayer, backgroundColor: style.backgroundColor)
  }

  private func layerOrigin(forKey key: LayerKey, parentLayer: CALayer) -> CGPoint {
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
    let inFrameTopY = (parentLayer.frame.height - layer.frame.height - (layer.frame.height * BAR_SPACE_HEIGHT_FACTOR)) / 2
    return CGPoint(x: 0, y: inFrameTopY)
  }

  private func bottomLayerOrigin(layer: CALayer, parentLayer: CALayer) -> CGPoint {
    let inFrameBottomY = (parentLayer.frame.height - layer.frame.height + (layer.frame.height * BAR_SPACE_HEIGHT_FACTOR)) / 2
    return CGPoint(x: 0, y: inFrameBottomY)
  }

  private func hiddenLayerOrigin(parentLayer: CALayer) -> CGPoint {
    return CGPoint(x: 0, y: parentLayer.frame.height)
  }
}
