import AVFoundation
import UIKit

class CaptionNoWordStyleEffectFactory: CaptionWordStyleEffectFactory {
  public var wordStyle: CaptionWordStyle = .none

  func createEffect(
    key: CaptionRowKey,
    map: CaptionStringsMap,
    duration: CFTimeInterval,
    textAlignment: CaptionTextAlignment
  ) -> PresentationEffect {
    let layerName = "noWordStyleLayer"
    return PresentationEffect(doEffect: { layer in
      let sublayer = CALayer()
      sublayer.name = layerName
      let bounds = CaptionSizingUtil.layoutForText(originalBounds: layer.bounds, textAlignment: textAlignment)
      sublayer.anchorPoint = bounds.anchorPoint
      sublayer.position = bounds.position
      sublayer.bounds = bounds.toBounds
      let lines = map.getValues(byKey: key)!
      for (index, line) in lines.enumerated() {
        let textLayer = createTextLayer(
          map: map,
          key: key,
          string: line.string.attributedString,
          index: index,
          parentLayer: sublayer,
          textAlignment: textAlignment,
          duration: duration
        )
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        sublayer.addSublayer(textLayer)
      }
      layer.addSublayer(sublayer)
    }, undoEffect: createSublayerRemover(byName: layerName))
  }
}

fileprivate func createTextLayer(
  map: CaptionStringsMap,
  key: CaptionRowKey,
  string: NSAttributedString,
  index: Int,
  parentLayer: CALayer,
  textAlignment: CaptionTextAlignment,
  duration: CFTimeInterval
) -> CATextLayer {
  let textLayer = CATextLayer()
  textLayer.contentsScale = UIScreen.main.scale
  textLayer.allowsFontSubpixelQuantization = true
  textLayer.allowsEdgeAntialiasing = true
  let textNaturalSize = string.size()
  let textSize = CGSize(width: textNaturalSize.width + 5, height: textNaturalSize.height)
  let textYOffset = (parentLayer.frame.height - textSize.height) / 2
  let textXOffset = textHorizontalOffset(textWidth: textSize.width, parentLayerWidth: parentLayer.frame.width, textAlignment: textAlignment)
  let textFrame = CGRect(origin: CGPoint(x: textXOffset, y: textYOffset), size: textSize)
  textLayer.frame = textFrame
  textLayer.shadowColor = UIColor.black.cgColor
  textLayer.shadowRadius = textSize.height / 25 * 0.5
  textLayer.shadowOpacity = 0.4
  textLayer.shadowOffset = CGSize(width: 0.0, height: textSize.height / 25)
  textLayer.string = string
  textLayer.alignmentMode = textAlignment.textLayerAlignmentMode()
  textLayer.opacity = 0
  let textAnimation = createTextAnimations(map: map, key: key, index: index, duration: duration)
  textLayer.add(textAnimation, forKey: "textLayerAnimation")
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
