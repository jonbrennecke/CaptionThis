import Foundation

fileprivate let BAR_SPACE_HEIGHT = CGFloat(10)
fileprivate let BAR_THICKNESS = CGFloat(4)

struct CaptionPresetLinePositions {
  public enum Key {
    case inFrameMiddle
    case inFrameTop
    case inFrameBottom
    case outOfFrameTop
    case outOfFrameBottom

    fileprivate static func getNextKey(forKey key: Key) -> Key {
      switch key {
      case .inFrameMiddle:
        return .inFrameTop
      case .inFrameTop:
        return .outOfFrameTop
      case .inFrameBottom:
        return .inFrameTop
      case .outOfFrameTop:
        return .outOfFrameBottom
      case .outOfFrameBottom:
        return .inFrameBottom
      }
    }
  }

  public class Iterator {
    public var key: Key

    public init(key: Key) {
      self.key = key
    }

    public func next() -> Key {
      key = Key.getNextKey(forKey: key)
      return key
    }
  }

  private let inFrameMiddlePosition: CGPoint
  private let inFrameTopPosition: CGPoint
  private let inFrameBottomPosition: CGPoint
  private let outOfFrameTopPosition: CGPoint
  private let outOfFrameBottomPosition: CGPoint

  public init(layer: CALayer, parentLayer: CALayer) {
    let inFrameMiddleY = (parentLayer.frame.height + layer.frame.height) / 2 - BAR_THICKNESS / 2
    let inFrameTopY = (parentLayer.frame.height - layer.frame.height - BAR_SPACE_HEIGHT) / 2 + BAR_THICKNESS / 2
    let inFrameBottomY = (parentLayer.frame.height - layer.frame.height + BAR_SPACE_HEIGHT) / 2 + BAR_THICKNESS / 2
    let outOfFrameTopY = -layer.frame.height
    let outOfFrameBottomY = parentLayer.frame.height
    let x = layer.position.x
    inFrameMiddlePosition = CGPoint(x: x, y: inFrameMiddleY)
    inFrameTopPosition = CGPoint(x: x, y: inFrameTopY)
    inFrameBottomPosition = CGPoint(x: x, y: inFrameBottomY)
    outOfFrameTopPosition = CGPoint(x: x, y: outOfFrameTopY)
    outOfFrameBottomPosition = CGPoint(x: x, y: outOfFrameBottomY)
  }

  public func getPosition(forKey key: Key) -> CGPoint {
    switch key {
    case .inFrameMiddle:
      return inFrameMiddlePosition
    case .inFrameTop:
      return inFrameTopPosition
    case .inFrameBottom:
      return inFrameBottomPosition
    case .outOfFrameTop:
      return outOfFrameTopPosition
    case .outOfFrameBottom:
      return outOfFrameBottomPosition
    }
  }
}
