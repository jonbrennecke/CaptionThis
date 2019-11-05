import AVFoundation

typealias CaptionStringSegment = Timed<NSAttributedString>

typealias CaptionStringSegmentLine = Array<CaptionStringSegment>

typealias GroupedCaptionStringSegmentLines = Array<Timed<Array<CaptionStringSegmentLine>>>

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
    .foregroundColor: style.textStyle.color.cgColor,
    .font: style.textStyle.font,
  ]
}

func groupCaptionStringSegmentLines(
  lines: Array<CaptionStringSegmentLine>,
  numberOfLinesToDisplay: Int
) -> GroupedCaptionStringSegmentLines {
  var groupedCaptionStringSegments = GroupedCaptionStringSegmentLines()
  for i in stride(from: 0, to: lines.count, by: numberOfLinesToDisplay) {
    var linesAtIndex = Array<CaptionStringSegmentLine>()
    for j in i ..< min(i + numberOfLinesToDisplay, lines.count) {
      let line = lines[j]
      linesAtIndex.append(line)
    }
    let flattenedLines = linesAtIndex.flatMap({ $0 })
    if let (timestamp, duration) = getTimestampAndTotalDuration(of: flattenedLines) {
      let timed = Timed(timestamp: timestamp, duration: duration, data: linesAtIndex)
      groupedCaptionStringSegments.append(timed)
    }
  }
  return groupedCaptionStringSegments
}

func makeCaptionStringSegmentLines(
  textSegments: [CaptionTextSegment],
  size: CGSize,
  style: CaptionStyle,
  numberOfLines: Int
) -> Array<Array<Timed<NSAttributedString>>> {
  let attributes = stringAttributes(for: style)
  var mutableTextSegments = textSegments
  var captionStringSegments = Array<Array<CaptionStringSegment>>()
  while mutableTextSegments.count > 0 {
    for _ in 0 ..< numberOfLines {
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

func groupCaptionStringSegmentLinesByRowKey(
  textSegments: [CaptionTextSegment],
  size: CGSize,
  style: CaptionStyle,
  keys: [CaptionRowKey]
) -> [CaptionRowKey: Array<CaptionStringSegmentLine>] {
  let attributes = stringAttributes(for: style)
  var segments = textSegments
  var segmentsByRow = [CaptionRowKey: Array<Array<CaptionStringSegment>>]()
  while segments.count > 0 {
    for key in keys {
      let width = CaptionSizingUtil.textWidth(forLayerSize: size)
      guard case let (lineSegments?, remainingSegments) = fitNextLine(
        textSegments: segments, width: width, attributes: attributes
      ) else {
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
  return segmentsByRow
}

fileprivate func interpolate(segments: [CaptionTextSegment]) -> [CaptionTextSegment] {
  var outputSegments = [CaptionTextSegment]()
  for segment in segments {
    let words = segment.text.components(separatedBy: .whitespacesAndNewlines).filter { !$0.isEmpty }
    let durationPerWord = words.count > 0 ? segment.duration / CFTimeInterval(words.count) : CFTimeInterval(0)
    for (index, word) in words.enumerated() {
      let timestamp = segment.timestamp + CFTimeInterval(index) * durationPerWord
      let outputSegment = CaptionTextSegment(duration: durationPerWord, timestamp: timestamp, text: word)
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
