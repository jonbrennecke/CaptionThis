import Foundation

fileprivate let BAR_SPACE_HEIGHT = CGFloat(10)

@objc
enum CaptionPresetTextAlignment: Int {
  case center
  case left
  case right

  public func textLayerAlignmentMode() -> CATextLayerAlignmentMode {
    switch self {
    case .center:
      return .center
    case .left:
      return .left
    case .right:
      return .right
    }
  }
}

protocol CaptionPresetTextAlignmentImpl {
  var textAlignment: CaptionPresetTextAlignment { get }
  func layerSize(forKey key: CaptionPresetLayerKey, parentLayer: CALayer, fontSize: CGFloat) -> CGSize
}

class CaptionPresetTextAlignmentLeftImpl: CaptionPresetTextAlignmentImpl {
  public let textAlignment: CaptionPresetTextAlignment = .left

  func layerSize(forKey _: CaptionPresetLayerKey, parentLayer: CALayer, fontSize: CGFloat) -> CGSize {
    let width = parentLayer.frame.width
    let height = fontSize
    return CGSize(width: width, height: height)
  }
}

class CaptionPresetTextAlignmentRightImpl: CaptionPresetTextAlignmentImpl {
  public let textAlignment: CaptionPresetTextAlignment = .right

  func layerSize(forKey _: CaptionPresetLayerKey, parentLayer: CALayer, fontSize: CGFloat) -> CGSize {
    let width = parentLayer.frame.width
    let height = fontSize
    return CGSize(width: width, height: height)
  }
}

class CaptionPresetTextAlignmentCenterImpl: CaptionPresetTextAlignmentImpl {
  public let textAlignment: CaptionPresetTextAlignment = .center

  func layerSize(forKey _: CaptionPresetLayerKey, parentLayer: CALayer, fontSize: CGFloat) -> CGSize {
    let width = parentLayer.frame.width
    let height = fontSize
    return CGSize(width: width, height: height)
  }
}
