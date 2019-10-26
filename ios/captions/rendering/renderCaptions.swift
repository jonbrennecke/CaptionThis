import Foundation

fileprivate let BAR_SPACE_HEIGHT_FACTOR = CGFloat(1.25)

func renderCaptions(
  layer: CALayer,
  style: CaptionStyle,
  textSegments: [CaptionTextSegment],
  duration: CFTimeInterval,
  backgroundHeight: Float
) {
  let rowKeys: [CaptionRowKey] = [.a, .b]
  let rowSize = CGSize(width: layer.frame.width, height: style.font.lineHeight)

  let map = makeCaptionStringsMap(
    textSegments: textSegments,
    size: rowSize,
    style: style,
    keys: rowKeys
  )
  let stringSegmentRows = makeCaptionStringSegmentRows(
    textSegments: textSegments,
    size: rowSize,
    style: style,
    numberOfRows: rowKeys.count
  )
  let timedStringSegmentRows = stringSegmentRows.map({ Timed.from(array: $0) }).compactMap({ $0 })
  for (index, _) in timedStringSegmentRows.enumerated() {
    if let lineStyleLayer = makeTranslateUpLineStyleLayer(
      rowSize: rowSize,
      parentSize: layer.frame.size,
      style: style,
      duration: duration,
      timedStringSegmentRows: timedStringSegmentRows,
      index: index,
      map: map
    ) {
      layer.addSublayer(lineStyleLayer)
    }
  }

  // TODO: rename "orderedSegments" to "groupedSegments" or similar
//  let orderedSegments = makeOrderedCaptionStringSegmentRows(
//    rows: stringSegmentRows,
//    numberOfRowsToDisplay: rowKeys.count
//  )
//  for timedRows in orderedSegments {
//    for (index, stringSegments) in timedRows.data.enumerated() {
//      let rowKey = CaptionRowKey.from(index: index)
//      let lineStyleLayer = makeTranslateUpLineStyleLayer(
//        rowSize: rowSize,
//        parentSize: layer.frame.size,
//        style: style,
//        duration: duration,
//        rowKey: rowKey,
//        stringSegments: stringSegments,
//        map: map,
//        timedRows: timedRows
//      )
//      layer.addSublayer(lineStyleLayer)
//    }
//  }

  // renderBackground

  let getSizeOfRow = { (_: CaptionRowKey) -> CGSize in
    rowSize
  }
  render(backgroundStyle: style.backgroundStyle)(
    layer, style, backgroundHeight, map, getSizeOfRow
  )
}
