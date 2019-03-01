import Foundation

fileprivate let BAR_SPACE_HEIGHT = CGFloat(10)
fileprivate let BAR_THICKNESS = CGFloat(4)

struct CaptionPresetLinePositions {
  public let inFrameMiddlePosition: CGPoint
  public let inFrameTopPosition: CGPoint
  public let inFrameBottomPosition: CGPoint
  public let outOfFrameTopPosition: CGPoint
  public let outOfFrameBottomPosition: CGPoint

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
}
