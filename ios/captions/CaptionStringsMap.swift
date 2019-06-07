import Foundation

class CaptionStringsMap {
  public typealias Value = [TaggedLine]

  public struct TaggedString {
    let attributedString: NSAttributedString
    let timestamp: CFTimeInterval
    let duration: CFTimeInterval
  }

  public struct TaggedLine {
    let string: TaggedString
    let substrings: [TaggedString]
    let timestamp: CFTimeInterval
    let duration: CFTimeInterval
  }

  private var data = [CaptionRowKey: Value]()

  public func getValues(byKey key: CaptionRowKey) -> Value? {
    return data[key]
  }

  public func setValues(byKey key: CaptionRowKey, values: Value) {
    data[key] = values
  }

  public func getLine(byKey key: CaptionRowKey, index: Int) -> TaggedLine? {
    guard let lines = getValues(byKey: key), index < lines.count else {
      return nil
    }
    return lines[index]
  }

  public func each(_ callback: (_ key: CaptionRowKey, _ value: Value) -> Void) {
    data.forEach { item in
      let (key, value) = item
      callback(key, value)
    }
  }

  public static func byFitting(
    textSegments: [CaptionTextSegment],
    rowSizes: [CaptionRowKey: CGSize],
    style: CaptionStyle,
    keys: [CaptionRowKey]
  ) -> CaptionStringsMap {
    let attributes = getStringAttributes(style: style)
    var segments = textSegments
    let map = CaptionStringsMap()
    while segments.count > 0 {
      for key in keys {
        guard let size = rowSizes[key] else {
          continue
        }
        let width = CaptionSizingUtil.textWidth(forLayerSize: size)
        guard case let (line?, remainingSegments) = fitNextLine(textSegments: segments, width: width, attributes: attributes) else {
          continue
        }
        segments = remainingSegments
        if var values = map.getValues(byKey: key) {
          values.append(line)
          map.setValues(byKey: key, values: values)
          continue
        }
        map.setValues(byKey: key, values: [line])
      }
    }
    return map
  }

  private static func interpolate(segments: [CaptionTextSegment]) -> [CaptionTextSegment] {
    var outputSegments = [CaptionTextSegment]()
    for segment in segments {
      let words = segment.text.components(separatedBy: .whitespacesAndNewlines).filter { !$0.isEmpty }
      let durationPerWord = segment.duration / Float(words.count)
      for (index, word) in words.enumerated() {
        let timestamp = segment.timestamp + Float(index) * durationPerWord
        let outputSegment = CaptionTextSegment(text: word, duration: durationPerWord, timestamp: timestamp)
        outputSegments.append(outputSegment)
      }
    }
    return outputSegments
  }

  private static func fitNextLine(
    textSegments: [CaptionTextSegment],
    width: CGFloat,
    attributes: [NSAttributedString.Key: Any]
  ) -> (line: TaggedLine?, remainingSegments: [CaptionTextSegment]) {
    let interpolatedSegments = interpolate(segments: textSegments)
    var textSegmentsMutableCopy = interpolatedSegments
    var attributedString = NSAttributedString(string: "", attributes: attributes)
    var substrings = [TaggedString]()
    var endTime = CFTimeInterval(0)
    while let segment = textSegmentsMutableCopy.first {
      let newString = "\(attributedString.string) \(segment.text)".trimmingCharacters(in: .whitespacesAndNewlines)
      let newAttributedString = NSAttributedString(string: newString, attributes: attributes)
      let newSize = newAttributedString.size()
      if newSize.width < width {
        let segmentAttributedString = NSAttributedString(string: segment.text, attributes: attributes)
        let timestamp = CFTimeInterval(segment.timestamp)
        let duration = CFTimeInterval(segment.duration)
        let taggedString = TaggedString(attributedString: segmentAttributedString, timestamp: timestamp, duration: duration)
        endTime = timestamp + duration
        substrings.append(taggedString)
        textSegmentsMutableCopy.removeFirst()
        attributedString = newAttributedString
        continue
      }
      break
    }
    if attributedString.length == 0 {
      return (line: nil, remainingSegments: textSegmentsMutableCopy)
    }
    let beginTime = CFTimeInterval(textSegments.first?.timestamp ?? 0)
    let duration = endTime - beginTime
    let string = TaggedString(attributedString: attributedString, timestamp: beginTime, duration: duration)
    let line = TaggedLine(string: string, substrings: substrings, timestamp: beginTime, duration: duration)
    return (line: line, remainingSegments: textSegmentsMutableCopy)
  }

  private static func getStringAttributes(style: CaptionPresetStyle) -> [NSAttributedString.Key: Any] {
    return [
      .foregroundColor: style.textColor.cgColor,
      .font: style.font,
    ]
  }
}
