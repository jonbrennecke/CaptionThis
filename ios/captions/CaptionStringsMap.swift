import Foundation

class CaptionStringsMap {
  public typealias Key = CaptionStyleImpl.LayerKey
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

  private var data = [Key: Value]()

  public func getValues(byKey key: Key) -> Value? {
    return data[key]
  }

  public func setValues(byKey key: Key, values: Value) {
    data[key] = values
  }

  public func getLine(byKey key: Key, index: Int) -> TaggedLine? {
    guard let lines = getValues(byKey: key), index < lines.count else {
      return nil
    }
    return lines[index]
  }

  public func each(_ callback: (_ key: Key, _ value: Value) -> Void) {
    data.forEach { item in
      let (key, value) = item
      callback(key, value)
    }
  }

  public static func byFitting(
    textSegments: [CaptionTextSegment],
    toLayersOfSize layerSizes: [Key: CGSize],
    style: CaptionPresetStyle
  ) -> CaptionStringsMap {
    let keys = listKeys(forLineStyle: style.lineStyle)
    var segments = textSegments
    let map = CaptionStringsMap()
    while segments.count > 0 {
      for key in keys {
        guard let size = layerSizes[key] else {
          continue
        }
        let width = CaptionSizingUtil.textWidth(forLayerSize: size)
        guard case let (line?, remainingSegments) = fitNextLine(textSegments: segments, width: width, style: style) else {
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

  // TODO: replace with `let keys = CaptionStyleImpl.listKeys(forLineStyle: style.lineStyle)`
  private static func listKeys(forLineStyle lineStyle: CaptionPresetLineStyle) -> [CaptionStyleImpl.LayerKey] {
    switch lineStyle {
    case .fadeInOut:
      return [.a, .b]
    case .translateY:
      return [.a, .b, .c]
    }
  }

  // TODO: replace with `TextSegment.arrayByInterpolatingWords(segments: [TextSegments])`
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
    style: CaptionPresetStyle
  ) -> (line: TaggedLine?, remainingSegments: [CaptionTextSegment]) {
    let interpolatedSegments = interpolate(segments: textSegments)
    var textSegmentsMutableCopy = interpolatedSegments
    let attributes = getStringAttributes(style: style)
    var attributedString = NSAttributedString(string: "", attributes: attributes)
    var substrings = [TaggedString]()
    var endTimestamp = CFTimeInterval(0)
    while let segment = textSegmentsMutableCopy.first {
      let newString = "\(attributedString.string) \(segment.text)".trimmingCharacters(in: .whitespacesAndNewlines)
      let newAttributedString = NSAttributedString(string: newString, attributes: attributes)
      let newSize = newAttributedString.size()
      if newSize.width < width {
        let segmentAttributedString = NSAttributedString(string: segment.text, attributes: attributes)
        let timestamp = CFTimeInterval(segment.timestamp)
        let duration = CFTimeInterval(segment.duration)
        let taggedString = TaggedString(attributedString: segmentAttributedString, timestamp: timestamp, duration: duration)
        endTimestamp = timestamp + duration
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
    let beginTimestamp = CFTimeInterval(textSegments.first?.timestamp ?? 0)
    let duration = endTimestamp - beginTimestamp
    let string = TaggedString(attributedString: attributedString, timestamp: beginTimestamp, duration: duration)
    let line = TaggedLine(string: string, substrings: substrings, timestamp: beginTimestamp, duration: duration)
    return (line: line, remainingSegments: textSegmentsMutableCopy)
  }

  private static let FONT_SIZE_LINE_HEIGHT_MULTIPLIER = CGFloat(1.5) // lineHeight is equal to this magic number multiplied by the font size

  private static func getStringAttributes(style: CaptionPresetStyle) -> [NSAttributedString.Key: Any] {
    let lineHeight = style.font.pointSize * FONT_SIZE_LINE_HEIGHT_MULTIPLIER
    let fontSize = style.font.pointSize
    let paragraphStyle = NSMutableParagraphStyle()
    paragraphStyle.lineHeightMultiple = 1.2
    return [
      .foregroundColor: style.textColor.cgColor,
      .font: style.font,
      .baselineOffset: -abs(fontSize - lineHeight) + (fontSize / 3),
      .paragraphStyle: paragraphStyle,
    ]
  }
}
