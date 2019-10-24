import AVFoundation
import UIKit

func renderNoWordStyle(
  layer: CALayer,
  key: CaptionRowKey,
  map: CaptionStringsMap,
  duration: CFTimeInterval,
  style: CaptionStyle
) {
  let sublayer = CALayer()
  let bounds = CaptionSizingUtil.layoutForText(
    originalBounds: layer.bounds,
    textAlignment: style.textAlignment
  )
  sublayer.anchorPoint = bounds.anchorPoint
  sublayer.position = bounds.position
  sublayer.bounds = bounds.toBounds
  guard let rowSegments = map.segmentsByRow[key] else {
    return
  }
  for (index, segments) in rowSegments.enumerated() {
    let segmentString = string(from: segments)
    let attributes = stringAttributes(for: style)
    let attributedString = NSAttributedString(string: segmentString, attributes: attributes)
    let textLayer = createTextLayer(
      map: map,
      key: key,
      attributedString: attributedString,
      index: index,
      layer: sublayer,
      textAlignment: style.textAlignment,
      duration: duration
    )
    textLayer.displayIfNeeded()
    textLayer.layoutIfNeeded()
    sublayer.addSublayer(textLayer)
  }
  layer.addSublayer(sublayer)
}

fileprivate func createTextLayer(
  map: CaptionStringsMap,
  key: CaptionRowKey,
  attributedString: NSAttributedString,
  index: Int,
  layer: CALayer,
  textAlignment: CaptionTextAlignment,
  duration: CFTimeInterval
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
  textLayer.opacity = 0
  let textAnimation = createTextAnimations(map: map, key: key, index: index, duration: duration)
  textLayer.add(textAnimation, forKey: nil)
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

fileprivate func createTextAnimations(map: CaptionStringsMap, key: CaptionRowKey, index: Int, duration: CFTimeInterval) -> CAAnimationGroup {
  let group = CAAnimationGroup()
  group.repeatCount = .greatestFiniteMagnitude
  let builder = CaptionAnimation.Builder()
  builder.insert(
    in: [FadeInAnimationStep()],
    center: [],
    out: [FadeOutAnimationStep()],
    index: index,
    key: key
  )
  group.animations = builder.build(withMap: map)
  group.duration = duration
  group.isRemovedOnCompletion = false
  group.fillMode = .forwards
  group.beginTime = AVCoreAnimationBeginTimeAtZero
  return group
}
