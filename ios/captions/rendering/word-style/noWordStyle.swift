import AVFoundation
import UIKit

func makeDefaultTextStyleLayer(
  within bounds: CGRect,
  style: CaptionStyle,
  stringSegments: [CaptionStringSegment]
) -> CALayer {
  let segmentString = string(from: stringSegments)
  let attributes = stringAttributes(for: style)
  let attributedString = NSAttributedString(string: segmentString, attributes: attributes)
  let textLayer = createTextLayer(
    within: bounds,
    attributedString: attributedString,
    textAlignment: style.textAlignment
  )
  textLayer.displayIfNeeded()
  textLayer.layoutIfNeeded()
  return textLayer
}

fileprivate func createTextLayer(
  within bounds: CGRect,
  attributedString: NSAttributedString,
  textAlignment: CaptionTextAlignment
) -> CATextLayer {
  let textLayer = CATextLayer()
  textLayer.contentsScale = UIScreen.main.scale
  textLayer.allowsFontSubpixelQuantization = true
  textLayer.allowsEdgeAntialiasing = true
  let textNaturalSize = attributedString.size()
  let textSize = CGSize(width: textNaturalSize.width + 5, height: textNaturalSize.height)
  let textYOffset = (bounds.height - textSize.height) / 2
  let textXOffset = textHorizontalOffset(
    textWidth: textSize.width,
    parentLayerWidth: bounds.width,
    textAlignment: textAlignment
  )
  let textFrame = CGRect(origin: CGPoint(x: textXOffset, y: textYOffset), size: textSize)
  textLayer.frame = textFrame
  textLayer.shadowColor = UIColor.black.cgColor
  textLayer.shadowRadius = textSize.height / 25 * 0.5
  textLayer.shadowOpacity = 0.4
  textLayer.shadowOffset = CGSize(width: 0.0, height: textSize.height / 25)
  textLayer.string = attributedString
  textLayer.alignmentMode = textAlignment.textLayerAlignmentMode()
  return textLayer
}

fileprivate func textHorizontalOffset(textWidth: CGFloat, parentLayerWidth parentWidth: CGFloat, textAlignment: CaptionTextAlignment) -> CGFloat {
  switch textAlignment {
  case .center:
    return (parentWidth - textWidth) / 2
  case .left:
    return 0
  case .right:
    return parentWidth - textWidth
  }
}
