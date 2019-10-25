import Foundation

typealias CaptionStringSegment = Timed<NSAttributedString>

typealias CaptionStringSegmentRow = [CaptionStringSegment]

typealias OrderedCaptionStringSegmentRows = Array<Timed<Array<CaptionStringSegmentRow>>>

struct Timed<T> {
  let timestamp: CFTimeInterval
  let duration: CFTimeInterval
  let data: T

  var endTimestamp: CFTimeInterval {
    return timestamp + duration
  }

  static func from(array: Array<Timed<T>>) -> Timed<Array<Timed<T>>>? {
    guard let (timestamp, duration) = getTimestampAndTotalDuration(of: array) else {
      return nil
    }
    return Timed<Array<Timed<T>>>(
      timestamp: timestamp,
      duration: duration,
      data: array
    )
  }
}

fileprivate func getTimestampAndTotalDuration<T>(
  of array: Array<Timed<T>>
) -> (timestamp: CFTimeInterval, duration: CFTimeInterval)? {
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
  return (timestamp: timestamp, duration: duration)
}

func string(from segments: [CaptionStringSegment]) -> String {
  return segments.reduce("") { str, segment in
    "\(str) \(segment.data.string)".trimmingCharacters(in: .whitespacesAndNewlines)
  }
}

func stringAttributes(for style: CaptionStyle) -> [NSAttributedString.Key: Any] {
  return [
    .foregroundColor: style.textColor.cgColor,
    .font: style.font,
  ]
}

func makeOrderedCaptionStringSegmentRows(
  rows: Array<CaptionStringSegmentRow>,
  numberOfRowsToDisplay: Int
) -> OrderedCaptionStringSegmentRows {
  var orderedCaptionStringSegments = OrderedCaptionStringSegmentRows()
  for i in stride(from: 0, to: rows.count, by: numberOfRowsToDisplay) {
    var rowsAtIndex = Array<CaptionStringSegmentRow>()
    for j in i ..< i + numberOfRowsToDisplay {
      let row = rows[j]
      rowsAtIndex.append(row)
    }
    let flattenedRows = rowsAtIndex.flatMap({ $0 })
    if let (timestamp, duration) = getTimestampAndTotalDuration(of: flattenedRows) {
      let timed = Timed(timestamp: timestamp, duration: duration, data: rowsAtIndex)
      orderedCaptionStringSegments.append(timed)
    }
  }
  return orderedCaptionStringSegments
}

func makeCaptionStringSegmentRows(
  textSegments: [CaptionTextSegment],
  rowSizes: [CaptionRowKey: CGSize],
  style: CaptionStyle,
  keys: [CaptionRowKey]
) -> Array<CaptionStringSegmentRow> {
  let attributes = stringAttributes(for: style)
  var mutableTextSegments = textSegments
  var captionStringSegments = Array<Array<CaptionStringSegment>>()
  while mutableTextSegments.count > 0 {
    for key in keys {
      guard let size = rowSizes[key] else {
        continue
      }
      let width = CaptionSizingUtil.textWidth(forLayerSize: size)
      guard case let (stringSegments?, remainingSegments) = fitNextLine(
        textSegments: mutableTextSegments,
        width: width,
        attributes: attributes
      ) else {
        continue
      }
      mutableTextSegments = remainingSegments
      captionStringSegments.append(stringSegments)
    }
  }
  return captionStringSegments
}

struct CaptionStringsMap {
  let segmentsByRow: [CaptionRowKey: Array<CaptionStringSegmentRow>]

  public static func byFitting(
    textSegments: [CaptionTextSegment],
    rowSizes: [CaptionRowKey: CGSize],
    style: CaptionStyle,
    keys: [CaptionRowKey]
  ) -> CaptionStringsMap {
    let attributes = stringAttributes(for: style)
    var segments = textSegments
    var segmentsByRow = [CaptionRowKey: Array<Array<CaptionStringSegment>>]()
    while segments.count > 0 {
      for key in keys {
        guard let size = rowSizes[key] else {
          continue
        }
        let width = CaptionSizingUtil.textWidth(forLayerSize: size)
        guard case let (lineSegments?, remainingSegments) = fitNextLine(textSegments: segments, width: width, attributes: attributes) else {
          continue
        }
        segments = remainingSegments
        if var values = segmentsByRow[key] {
          values.append(lineSegments)
          segmentsByRow[key] = values
          continue
        }
        segmentsByRow[key] = [lineSegments]
      }
    }
    return CaptionStringsMap(segmentsByRow: segmentsByRow)
  }
}

fileprivate func interpolate(segments: [CaptionTextSegment]) -> [CaptionTextSegment] {
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

fileprivate func fitNextLine(
  textSegments: [CaptionTextSegment],
  width: CGFloat,
  attributes: [NSAttributedString.Key: Any]
) -> (lineSegments: [CaptionStringSegment]?, remainingSegments: [CaptionTextSegment]) {
  let interpolatedSegments = interpolate(segments: textSegments)
  var textSegmentsMutableCopy = interpolatedSegments
  var attributedString = NSAttributedString(string: "", attributes: attributes)
  var stringSegments = [CaptionStringSegment]()
  while let segment = textSegmentsMutableCopy.first {
    let newString = "\(attributedString.string) \(segment.text)".trimmingCharacters(in: .whitespacesAndNewlines)
    let newAttributedString = NSAttributedString(string: newString, attributes: attributes)
    let newSize = newAttributedString.size()
    if newSize.width < width {
      let segmentAttributedString = NSAttributedString(string: segment.text, attributes: attributes)
      let timestamp = CFTimeInterval(segment.timestamp)
      let duration = CFTimeInterval(segment.duration)
      let stringSegment = CaptionStringSegment(
        timestamp: timestamp,
        duration: duration,
        data: segmentAttributedString
      )
      stringSegments.append(stringSegment)
      textSegmentsMutableCopy.removeFirst()
      attributedString = newAttributedString
      continue
    }
    break
  }
  return (lineSegments: stringSegments, remainingSegments: textSegmentsMutableCopy)
}
