import Foundation

public struct CaptionTextSegment {
  let duration: CFTimeInterval
  let timestamp: CFTimeInterval
  let text: String

  public init(duration: CFTimeInterval, timestamp: CFTimeInterval, text: String) {
    self.duration = duration
    self.timestamp = timestamp
    self.text = text
  }
}
