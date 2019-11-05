import AVFoundation

public func renderCaptions(
  layer: CALayer,
  style: CaptionStyle,
  textSegments: [CaptionTextSegment],
  duration: CFTimeInterval
) {
  let rowKeys: [CaptionRowKey] = [.a, .b]
  let rowSize = CGSize(width: layer.frame.width, height: style.textStyle.font.lineHeight)
  let linesByRowKey = groupCaptionStringSegmentLinesByRowKey(
    textSegments: textSegments,
    size: rowSize,
    style: style,
    keys: rowKeys
  )
  let stringSegmentLines = makeCaptionStringSegmentLines(
    textSegments: textSegments,
    size: rowSize,
    style: style,
    numberOfLines: rowKeys.count
  )
  renderCaptionLines(
    style: style,
    layer: layer,
    duration: duration,
    rowSize: rowSize,
    stringSegmentLines: stringSegmentLines
  )
  renderCapionBackground(
    captionStyle: style,
    layer: layer,
    linesByRowKey: linesByRowKey,
    timestampOfFirstSegment: stringSegmentLines.first?.first?.timestamp ?? 0,
    getSizeOfRow: { (_: CaptionRowKey) -> CGSize in
      rowSize
    }
  )
}
