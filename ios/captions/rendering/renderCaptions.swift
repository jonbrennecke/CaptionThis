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
  renderLineStyle(
    style: style,
    layer: layer,
    duration: duration,
    rowSize: rowSize,
    numberOfRows: rowKeys.count,
    stringSegmentRows: stringSegmentRows,
    map: map
  )
  render(backgroundStyle: style.backgroundStyle)(
    layer, style, backgroundHeight, map, { (_: CaptionRowKey) -> CGSize in
      rowSize
    }
  )
}
