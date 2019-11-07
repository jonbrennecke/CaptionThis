import AVFoundation

class CaptionSizingUtil {
  private static let widthPercentOfLayer = CGFloat(0.8)

  public static func textWidth(forLayerSize size: CGSize) -> CGFloat {
    return size.width * widthPercentOfLayer
  }

  public struct CaptionLayerLayout {
    let fromBounds: CGRect
    let toBounds: CGRect
    let anchorPoint: CGPoint
    let position: CGPoint

    init(from: CGRect, to: CGRect, anchorPoint: CGPoint, position: CGPoint) {
      fromBounds = from
      toBounds = to
      self.anchorPoint = anchorPoint
      self.position = position
    }
  }

  public static func layoutForText(originalBounds: CGRect, textAlignment: CaptionStyle.TextStyle.Alignment) -> CaptionLayerLayout {
    switch textAlignment {
    case .center:
      let position = CGPoint(x: originalBounds.width / 2, y: 0)
      let anchorPoint = CGPoint(x: 0.5, y: 0)
      let fromBounds = CGRect(origin: .zero, size: CGSize(width: 0, height: originalBounds.height))
      let toBounds = CGRect(origin: .zero, size: originalBounds.size)
      return CaptionLayerLayout(from: fromBounds, to: toBounds, anchorPoint: anchorPoint, position: position)
    case .left:
      let width = textWidth(forLayerSize: originalBounds.size)
      let origin = CGPoint(x: originalBounds.width * (1 - widthPercentOfLayer) / 2, y: 0)
      let fromBounds = CGRect(origin: .zero, size: CGSize(width: 0, height: originalBounds.height))
      let toSize = CGSize(width: width, height: originalBounds.height)
      let toBounds = CGRect(origin: .zero, size: toSize)
      return CaptionLayerLayout(from: fromBounds, to: toBounds, anchorPoint: .zero, position: origin)
    case .right:
      let position = CGPoint(x: originalBounds.width * (1 - widthPercentOfLayer) / 2, y: 0)
      let anchorPoint = CGPoint(x: 0, y: 0)
      let fromBounds = CGRect(origin: .zero, size: CGSize(width: 0, height: originalBounds.height))
      let width = textWidth(forLayerSize: originalBounds.size)
      let toSize = CGSize(width: width, height: originalBounds.height)
      let toBounds = CGRect(origin: .zero, size: toSize)
      return CaptionLayerLayout(from: fromBounds, to: toBounds, anchorPoint: anchorPoint, position: position)
    }
  }
}
