import Foundation

fileprivate let DEFAULT_FONT_FAMILY: String = "Helvetica"
fileprivate let DEFAULT_FONT_SIZE: Float = 20
fileprivate let DEFAULT_BACKGROUND_COLOR: UIColor = UIColor.black.withAlphaComponent(0)
fileprivate let DEFAULT_TEXT_COLOR: UIColor = .black

@objc
class VideoAnimationBridgeParams: NSObject {
  @objc
  public var orientation: UIImage.Orientation = .up
  @objc
  public var textSegments: [VideoAnimationBridgeTextSegmentParams]?
  @objc
  public var fontFamily: String?
  @objc
  public var fontSize: NSNumber?
  @objc
  public var backgroundColor: UIColor?
  @objc
  public var textColor: UIColor?
  @objc
  public var playbackTime: NSNumber?
  @objc
  public var duration: NSNumber?
  @objc
  public var lineStyle: VideoAnimationBridgeLineStyle = .twoLines
  
  public func model() -> VideoAnimationLayerModel {
    let modelTextSegmentsNested = textSegments?.map { t -> [TextSegmentModel] in
      let strings = t.text.split(separator: " ")
      return strings.map { str -> TextSegmentModel in
       return TextSegmentModel(duration: t.duration, timestamp: t.timestamp, text: String(str))
      }
    } ?? []
    let modelTextSegments = Array(modelTextSegmentsNested.joined())
    let modelFontFamily = fontFamily ?? DEFAULT_FONT_FAMILY
    let modelFontSize = fontSize?.floatValue ?? DEFAULT_FONT_SIZE
    let modelBackgroundColor = backgroundColor ?? DEFAULT_BACKGROUND_COLOR
    let modelTextColor = textColor ?? DEFAULT_TEXT_COLOR
    let modelPlaybackTime = playbackTime?.floatValue ?? 0
    let modelDuration = duration?.floatValue ?? 0
    let modelLineStyle: VideoAnimationLineStyle = lineStyle == .oneLine ? .oneLine : .twoLines
    return VideoAnimationLayerModel(
      textSegments: modelTextSegments,
      fontFamily: modelFontFamily,
      fontSize: modelFontSize,
      backgroundColor: modelBackgroundColor,
      textColor: modelTextColor,
      playbackTime: modelPlaybackTime,
      duration: modelDuration,
      lineStyle: modelLineStyle)
  }
}

@objc
enum VideoAnimationBridgeLineStyle: Int {
  case oneLine = 1
  case twoLines = 2
}

@objc
class VideoAnimationBridgeTextSegmentParams: NSObject {
  let duration: Float
  let timestamp: Float
  let text: String

  @objc
  init(text: String, duration: Float, timestamp: Float) {
    self.duration = duration
    self.timestamp = timestamp
    self.text = text
  }
}
