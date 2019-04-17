import Foundation

@objc
class CaptionTextSegment: NSObject {
  // TODO: duration and timestamp should be CFTimeInterval
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
