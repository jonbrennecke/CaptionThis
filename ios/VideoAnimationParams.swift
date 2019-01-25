import Foundation

@objc
enum VideoAnimationLineStyle: Int {
  case oneLine = 1
  case twoLines = 2
}

@objc
class VideoAnimationParams: NSObject {
  @objc
  var textSegments: [TextSegmentParams]?
  @objc
  var fontFamily: String?
  @objc
  var fontSize: NSNumber?
  @objc
  var backgroundColor: UIColor?
  @objc
  var textColor: UIColor?
  @objc
  var playbackTime: NSNumber?
  @objc
  var duration: NSNumber?
  @objc
  var lineStyle: VideoAnimationLineStyle = .twoLines
}

@objc
class TextSegmentParams: NSObject {
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
