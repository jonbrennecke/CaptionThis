import UIKit

fileprivate let BAR_SPACE_HEIGHT_FACTOR = CGFloat(1.25)

class CaptionStyleImpl {
  public enum LayerKey {
    case a
    case b
    case c

    public var index: Int {
      switch self {
      case .a:
        return 0
      case .b:
        return 1
      case .c:
        return 2
      }
    }

    public var nextKey: LayerKey {
      switch self {
      case .a:
        return .b
      case .b:
        return .c
      case .c:
        return .a
      }
    }
  }

  public struct Layers {
    let a = createLayer()
    let b = createLayer()
    let c = createLayer()

    private static func createLayer() -> CALayer {
      let layer = CALayer()
      layer.opacity = 0
      layer.contentsScale = UIScreen.main.scale
      return layer
    }

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

    public func each(_ callback: (_ key: LayerKey, _ layer: CALayer) -> Void) {
      [LayerKey.a, LayerKey.b, LayerKey.c].forEach { key in
        let layer = get(byKey: key)
        callback(key, layer)
      }
    }
  }

  public let layers = Layers()

  private let textSegments: [CaptionTextSegment]
  private let style: CaptionPresetStyle
  private let layout: CaptionViewLayout
  private let duration: CFTimeInterval

  public init(
    textSegments: [CaptionTextSegment],
    style: CaptionPresetStyle,
    layout: CaptionViewLayout,
    duration: CFTimeInterval
  ) {
    self.textSegments = textSegments
    self.style = style
    self.layout = layout
    self.duration = duration
  }

  func resize(inParentLayer parentLayer: CALayer) {
    let layerASize = resize(key: .a, parentLayer: parentLayer)
    let layerBSize = resize(key: .b, parentLayer: parentLayer)
    let layerCSize = resize(key: .c, parentLayer: parentLayer)
    let layerSizes: [LayerKey: CGSize] = [.a: layerASize, .b: layerBSize, .c: layerCSize]

    let lineStyleEffectFactory = getLineStyleEffectFactory(style: style.lineStyle)
    let wordStyleEffectFactory = getWordStyleEffectFactory(style: style.wordStyle)
    let backgroundStyleEffectFactory = getBackgroundStyleEffectFactory(style: style.backgroundStyle)

    let keys = lineStyleEffectFactory.allEffectedKeys
    let map = CaptionStringsMap.byFitting(textSegments: textSegments, toLayersOfSize: layerSizes, style: style, keys: keys)

    map.each { key, _ in
      let effect = composeEffect(
        lineStyleEffectFactory.createEffect(key: key, map: map, duration: duration),
        wordStyleEffectFactory.createEffect(key: key, map: map, duration: duration, textAlignment: style.textAlignment)
      )
      effect.doEffect(layer: layers.get(byKey: key))
    }
    let effect = backgroundStyleEffectFactory.createEffect(backgroundColor: style.backgroundColor, layout: layout, map: map)
    effect.doEffect(layer: parentLayer)
  }

  private func resize(key: LayerKey, parentLayer: CALayer) -> CGSize {
    let layer = layers.get(byKey: key)
    let origin = layerOrigin(forKey: key, parentLayer: parentLayer)
    let size = layerSize(parentLayer: parentLayer, fontSize: style.font.lineHeight)
    layer.frame = CGRect(origin: origin, size: size)
    return size
  }

  private func layerSize(parentLayer: CALayer, fontSize: CGFloat) -> CGSize {
    let width = parentLayer.frame.width
    let height = fontSize
    return CGSize(width: width, height: height)
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
