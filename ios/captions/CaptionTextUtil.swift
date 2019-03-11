import Foundation

// TODO: rename class
class CaptionTextUtil {
  static func fitText(
    layerSizes: [CaptionPresetLayerKey: CGSize],
    textSegments: [TextSegment],
    style: CaptionPresetStyle,
    layout: VideoAnimationLayerLayout
  ) -> [CaptionPresetLayerKey: [NSAttributedString]] {
    let keys = listKeys(forLineStyle: style.lineStyle)
    var stringsMap = [CaptionPresetLayerKey: [NSAttributedString]]()
    var segments = textSegments
    while segments.count > 0 {
      for key in keys {
        guard let size = layerSizes[key] else {
          continue
        }
        let width = CaptionSizingUtil.textWidth(forLayerSize: size)
        let (string, remainingSegments) = fitText(width: width, textSegments: segments, style: style, layout: layout)
        segments = remainingSegments
        if var strings = stringsMap[key] {
          strings.append(string)
          stringsMap[key] = strings
          continue
        }
        stringsMap[key] = [string]
      }
    }
    return stringsMap
  }
  
  private static func listKeys(forLineStyle lineStyle: CaptionPresetLineStyle) -> [CaptionPresetLayerKey] {
    switch lineStyle {
    case .fadeInOut:
      return [.a, .b]
    case .translateY:
      return [.a, .b, .c]
    }
  }

  static func fitText(
    width: CGFloat,
    textSegments: [TextSegment],
    style: CaptionPresetStyle,
    layout: VideoAnimationLayerLayout
  ) -> (string: NSAttributedString, remainingSegments: [TextSegment]) {
    var textSegmentsMutableCopy = textSegments
    let attributes = getStringAttributes(style: style, layout: layout)
    var attributedString = NSAttributedString(string: "", attributes: attributes)
    while let segment = textSegmentsMutableCopy.first {
      let newString = "\(attributedString.string) \(segment.text)".trimmingCharacters(in: .whitespacesAndNewlines)
      let newAttributedString = NSAttributedString(string: newString, attributes: attributes)
      let newSize = newAttributedString.size()
      if newSize.width < width {
        textSegmentsMutableCopy.removeFirst()
        attributedString = newAttributedString
        continue
      }
      break
    }
    return (string: attributedString, remainingSegments: textSegmentsMutableCopy)
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
