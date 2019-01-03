import Foundation

@objc
class VideoAnimationParams : NSObject {
  let textSegments: [TextSegmentParams]
  let fontFamily: String
  let backgroundColor: UIColor
  let textColor: UIColor
  
  @objc
  init(textSegments: [TextSegmentParams], fontFamily: String, backgroundColor: UIColor, textColor: UIColor) {
    self.textSegments = textSegments
    self.fontFamily = fontFamily
    self.backgroundColor = backgroundColor
    self.textColor = textColor
  }
}

@objc
class TextSegmentParams : NSObject {
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
