import Foundation

@objc
enum CaptionWordStyle: Int {
  case animated
  case none
}

func makeWordStyleLayer(
  within bounds: CGRect,
  rowKey: CaptionRowKey,
  stringSegments: [CaptionStringSegment],
  style: CaptionStyle,
  map: CaptionStringsMap,
  duration: CFTimeInterval
) -> CALayer {
  switch style.wordStyle {
  case .animated:
    return makeAnimatedWordStyleLayer(
      within: bounds,
      key: rowKey,
      segments: stringSegments,
      map: map,
      style: style,
      duration: duration
    )
  default:
    return makeDefaultTextStyleLayer(
      within: bounds,
      style: style,
      stringSegments: stringSegments
    )
  }
}
