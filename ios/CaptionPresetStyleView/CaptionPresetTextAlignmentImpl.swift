import Foundation

fileprivate let BAR_THICKNESS = CGFloat(4)
fileprivate let BAR_SPACE_HEIGHT = CGFloat(10)

@objc
enum CaptionPresetTextAlignment: Int {
  case center
  case left
  case right
}

protocol CaptionPresetTextAlignmentImpl {
  var textAlignment: CaptionPresetTextAlignment { get }
  func layerSize(forKey key: CaptionPresetLayerKey, parentLayer: CALayer) -> CGSize
}

class CaptionPresetTextAlignmentLeftImpl: CaptionPresetTextAlignmentImpl {
  public let textAlignment: CaptionPresetTextAlignment = .left

  func layerSize(forKey _: CaptionPresetLayerKey, parentLayer: CALayer) -> CGSize {
    return fullSize(parentLayer: parentLayer)
  }

  private func fullSize(parentLayer: CALayer) -> CGSize {
    let width = parentLayer.frame.width
    let height = BAR_THICKNESS
    return CGSize(width: width, height: height)
  }

  private func halfSize(parentLayer: CALayer) -> CGSize {
    let width = parentLayer.frame.width / 2
    let height = BAR_THICKNESS
    return CGSize(width: width, height: height)
  }
}

class CaptionPresetTextAlignmentRightImpl: CaptionPresetTextAlignmentImpl {
  public let textAlignment: CaptionPresetTextAlignment = .right

  func layerSize(forKey _: CaptionPresetLayerKey, parentLayer: CALayer) -> CGSize {
    return fullSize(parentLayer: parentLayer)
  }

  private func fullSize(parentLayer: CALayer) -> CGSize {
    let width = parentLayer.frame.width
    let height = BAR_THICKNESS
    return CGSize(width: width, height: height)
  }

  private func halfSize(parentLayer: CALayer) -> CGSize {
    let width = parentLayer.frame.width / 2
    let height = BAR_THICKNESS
    return CGSize(width: width, height: height)
  }
}

class CaptionPresetTextAlignmentCenterImpl: CaptionPresetTextAlignmentImpl {
  public let textAlignment: CaptionPresetTextAlignment = .center

  func layerSize(forKey _: CaptionPresetLayerKey, parentLayer: CALayer) -> CGSize {
    return fullSize(parentLayer: parentLayer)
  }

  private func fullSize(parentLayer: CALayer) -> CGSize {
    let width = parentLayer.frame.width
    let height = BAR_THICKNESS
    return CGSize(width: width, height: height)
  }

  private func halfSize(parentLayer: CALayer) -> CGSize {
    let width = parentLayer.frame.width / 2
    let height = BAR_THICKNESS
    return CGSize(width: width, height: height)
  }
}
