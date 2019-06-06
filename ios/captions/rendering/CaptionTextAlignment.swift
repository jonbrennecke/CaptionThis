import Foundation

@objc
enum CaptionTextAlignment: Int {
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
