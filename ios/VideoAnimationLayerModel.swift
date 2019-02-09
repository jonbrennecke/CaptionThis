import Foundation

struct VideoAnimationLayerModel {
  public var textSegments: [TextSegmentModel]
  public var fontFamily: String
  public var fontSize: Float
  public var backgroundColor: UIColor
  public var textColor: UIColor
  public var playbackTime: Float
  public var duration: Float
  public var lineStyle: VideoAnimationLineStyle
  public var alignmentMode: VideoAnimationAlignmentMode
}

enum VideoAnimationLineStyle {
  case oneLine
  case twoLines
}

enum VideoAnimationAlignmentMode {
  case center
  case right
  case left

  public func asTextLayerAlignmentMode() -> CATextLayerAlignmentMode {
    switch self {
    case .center:
      return .center
    case .right:
      return .right
    case .left:
      return .left
    }
  }
}

struct TextSegmentModel {
  let duration: Float
  let timestamp: Float
  let text: String
}
