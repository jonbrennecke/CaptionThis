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
    let wholeString: TaggedString
    let wordSubstrings: [TaggedString]
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
    textSegments: [TextSegment],
    toLayersOfSize layerSizes: [Key: CGSize],
    style: CaptionPresetStyle,
    layout: VideoAnimationLayerLayout
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
        guard case let (line?, remainingSegments) = fitNextLine(textSegments: segments, width: width, style: style, layout: layout) else {
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
  private static func interpolate(segments: [TextSegment]) -> [TextSegment] {
    var outputSegments = [TextSegment]()
    for segment in segments {
      let words = segment.text.components(separatedBy: .whitespacesAndNewlines).filter { !$0.isEmpty }
      let durationPerWord = segment.duration / Float(words.count)
      for (index, word) in words.enumerated() {
        let timestamp = segment.timestamp + Float(index) * durationPerWord
        let outputSegment = TextSegment(text: word, duration: durationPerWord, timestamp: timestamp)
        outputSegments.append(outputSegment)
      }
    }
    return outputSegments
  }

  private static func fitNextLine(
    textSegments: [TextSegment],
    width: CGFloat,
    style: CaptionPresetStyle,
    layout: VideoAnimationLayerLayout
  ) -> (line: TaggedLine?, remainingSegments: [TextSegment]) {
    let interpolatedSegments = interpolate(segments: textSegments)
    var textSegmentsMutableCopy = interpolatedSegments
    let attributes = getStringAttributes(style: style, layout: layout)
    var attributedString = NSAttributedString(string: "", attributes: attributes)
    var wordSubstrings = [TaggedString]()
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
        wordSubstrings.append(taggedString)
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
    let wholeString = TaggedString(attributedString: attributedString, timestamp: beginTimestamp, duration: duration)
    let line = TaggedLine(wholeString: wholeString, wordSubstrings: wordSubstrings, timestamp: beginTimestamp, duration: duration)
    return (line: line, remainingSegments: textSegmentsMutableCopy)
  }

  private static func getStringAttributes(style: CaptionPresetStyle, layout: VideoAnimationLayerLayout) -> [NSAttributedString.Key: Any] {
    let lineHeight = CGFloat(layout.textLineHeight)
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
