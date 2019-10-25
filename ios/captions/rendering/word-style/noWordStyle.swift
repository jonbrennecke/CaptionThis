import AVFoundation
import UIKit

func makeNoWordStyleTextStyleLayer(style: CaptionStyle, layer: CALayer, stringSegments: [CaptionStringSegment]) -> CALayer {
  let segmentString = string(from: stringSegments)
  let attributes = stringAttributes(for: style)
  let attributedString = NSAttributedString(string: segmentString, attributes: attributes)
  let textLayer = createTextLayer(
    attributedString: attributedString,
    layer: layer,
    textAlignment: style.textAlignment
  )
  textLayer.displayIfNeeded()
  textLayer.layoutIfNeeded()
  layer.addSublayer(textLayer)
  return textLayer
}

fileprivate func createTextLayer(
  attributedString: NSAttributedString,
  layer: CALayer,
  textAlignment: CaptionTextAlignment
) -> CATextLayer {
  let textLayer = CATextLayer()
  textLayer.contentsScale = UIScreen.main.scale
  textLayer.allowsFontSubpixelQuantization = true
  textLayer.allowsEdgeAntialiasing = true
  let textNaturalSize = attributedString.size()
  let textSize = CGSize(width: textNaturalSize.width + 5, height: textNaturalSize.height)
  let textYOffset = (layer.frame.height - textSize.height) / 2
  let textXOffset = textHorizontalOffset(
    textWidth: textSize.width,
    parentLayerWidth: layer.frame.width,
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
