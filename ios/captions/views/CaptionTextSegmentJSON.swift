import Captions
import Foundation

@objc(HSCaptionTextSegmentJSON)
final class CaptionTextSegmentJSON: NSObject {
  let duration: CFTimeInterval
  let timestamp: CFTimeInterval
  let text: String

  init(duration: CFTimeInterval, timestamp: CFTimeInterval, text: String) {
    self.duration = duration
    self.timestamp = timestamp
    self.text = text
  }

  var textSegment: CaptionTextSegment {
    CaptionTextSegment(duration: duration, timestamp: timestamp, text: text)
  }

  @objc(fromJSON:)
  static func from(json: Data) -> CaptionTextSegmentJSON? {
    try? JSONDecoder().decode(CaptionTextSegmentJSON.self, from: json)
  }
}

extension CaptionTextSegmentJSON: Encodable {}
extension CaptionTextSegmentJSON: Decodable {}
