import Foundation

@objc
class TextOverlayParams : NSObject {
  let duration: Float
  let timestamp: Float
  let text: String
  // TODO: let backgroundColor: UIColor
  // TODO: let textColor: UIColor
  
  @objc
  init(text: String, duration: Float, timestamp: Float) {
    self.duration = duration
    self.timestamp = timestamp
    self.text = text
  }
}
