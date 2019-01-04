import Foundation

@objc
class VideoAnimationParams: NSObject {
  @objc
  var textSegments: [TextSegmentParams]?
  @objc
  var fontFamily: String?
  @objc
  var backgroundColor: UIColor?
  @objc
  var textColor: UIColor?

  //  @objc
  //  init(textSegments: [TextSegmentParams], fontFamily: String, backgroundColor: UIColor, textColor: UIColor) {
//    self.textSegments = textSegments
//    self.fontFamily = fontFamily
//    self.backgroundColor = backgroundColor
//    self.textColor = textColor
  //  }
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
