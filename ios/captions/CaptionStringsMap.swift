import Foundation

struct Timed<T> {
  let timestamp: CFTimeInterval
  let duration: CFTimeInterval
  let data: T

  static func from(array: Array<Timed<T>>) -> Timed<Array<Timed<T>>>? {
    let sortedByStartTimestamp = array.sorted(by: { $0.timestamp < $1.timestamp })
    let sortedByEndTimestamp = array.sorted(by: {
      ($0.timestamp + $0.duration) < ($1.timestamp + $1.duration)
    })
    guard
      let first = sortedByStartTimestamp.first,
      let last = sortedByEndTimestamp.last
    else {
      return nil
    }
    let timestamp = first.timestamp
    let duration = (last.timestamp + last.duration) - timestamp
    return Timed<Array<Timed<T>>>(
      timestamp: timestamp,
      duration: duration,
      data: array
    )
  }
}

typealias CaptionStringSegment = Timed<NSAttributedString>

typealias CaptionRowSegments = (CaptionRowKey, Array<CaptionStringSegment>)

// get all the string segments for a row
typealias CaptionRowSegmentsAccessor = (CaptionRowKey) -> Array<CaptionRowSegments>

// a group of CaptionStringSegments that are presented together
typealias CaptionPresentationRowSegments = (CaptionRowKey, Array<Timed<Array<CaptionStringSegment>>>)

class CaptionStringsMap {
  public struct TaggedLine {
    let string: CaptionStringSegment
    let substrings: [CaptionStringSegment]
    let timestamp: CFTimeInterval
    let duration: CFTimeInterval
  }

  // TODO: should be immutable
  var rowData = [CaptionRowKey: [TaggedLine]]()

  public func getValues(byKey key: CaptionRowKey) -> [TaggedLine]? {
    return rowData[key]
  }

  public func setValues(byKey key: CaptionRowKey, values: [TaggedLine]) {
    rowData[key] = values
  }

  public func getLine(byKey key: CaptionRowKey, index: Int) -> TaggedLine? {
    guard let lines = getValues(byKey: key), index < lines.count else {
      return nil
    }
    return lines[index]
  }

  public func each(_ callback: (_ key: CaptionRowKey, _ value: [TaggedLine]) -> Void) {
    rowData.forEach { item in
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
    var stringSegments = [CaptionStringSegment]()
    var endTimestamp = CFTimeInterval(0)
    while let segment = textSegmentsMutableCopy.first {
      let newString = "\(attributedString.string) \(segment.text)".trimmingCharacters(in: .whitespacesAndNewlines)
      let newAttributedString = NSAttributedString(string: newString, attributes: attributes)
      let newSize = newAttributedString.size()
      if newSize.width < width {
        let segmentAttributedString = NSAttributedString(string: segment.text, attributes: attributes)
        let timestamp = CFTimeInterval(segment.timestamp)
        let duration = CFTimeInterval(segment.duration)
        let stringSegment = CaptionStringSegment(timestamp: timestamp, duration: duration, data: segmentAttributedString)
        endTimestamp = timestamp + duration
        stringSegments.append(stringSegment)
        textSegmentsMutableCopy.removeFirst()
        attributedString = newAttributedString
        continue
      }
      break
    }
    if attributedString.length == 0 {
      return (line: nil, remainingSegments: textSegmentsMutableCopy)
    }
    let timestamp = CFTimeInterval(textSegments.first?.timestamp ?? 0)
    let duration = endTimestamp - timestamp
    let stringSegment = CaptionStringSegment(
      timestamp: timestamp,
      duration: duration,
      data: attributedString
    )
    let line = TaggedLine(
      string: stringSegment,
      substrings: stringSegments,
      timestamp: timestamp,
      duration: duration
    )
    return (line: line, remainingSegments: textSegmentsMutableCopy)
  }

  private static func getStringAttributes(style: CaptionStyle) -> [NSAttributedString.Key: Any] {
    return [
      .foregroundColor: style.textColor.cgColor,
      .font: style.font,
    ]
  }
}
