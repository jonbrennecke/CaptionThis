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
}

enum VideoAnimationLineStyle {
  case oneLine
  case twoLines
}

struct TextSegmentModel {
  let duration: Float
  let timestamp: Float
  let text: String
}
