import UIKit

class CaptionPresetNoWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .none

  func applyWordStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, map: CaptionStringsMap, layout: VideoAnimationLayerLayout, duration: CFTimeInterval) {
    layer.sublayers = nil
    let sublayer = CALayer()
    let bounds = CaptionSizingUtil.layoutForText(originalBounds: layer.bounds, textAlignment: textAlignment)
    sublayer.anchorPoint = bounds.anchorPoint
    sublayer.position = bounds.position
    sublayer.bounds = bounds.toBounds
    let lines = map.getValues(byKey: key)!
    for (index, line) in lines.enumerated() {
      let textLayer = createTextLayer(
        key: key,
        string: line.wholeString.attributedString,
        index: index,
        parentLayer: sublayer,
        layout: layout,
        textAlignment: textAlignment,
        duration: duration
      )
      sublayer.addSublayer(textLayer)
    }
    layer.addSublayer(sublayer)
  }

  private func createTextLayer(
    key: CaptionStyleImpl.LayerKey,
    string: NSAttributedString,
    index: Int,
    parentLayer: CALayer,
    layout: VideoAnimationLayerLayout,
    textAlignment: CaptionPresetTextAlignment,
    duration: CFTimeInterval
  ) -> CATextLayer {
    let textLayer = CATextLayer()
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.allowsFontSubpixelQuantization = true
    textLayer.allowsEdgeAntialiasing = true
    let textSize = string.size()
    let textYOffset = (parentLayer.frame.height - textSize.height) / 2
    let textXOffset = textHorizontalOffset(textWidth: textSize.width, parentLayerWidth: parentLayer.frame.width, textAlignment: textAlignment)
    let textFrame = CGRect(origin: CGPoint(x: textXOffset, y: textYOffset), size: textSize)
    textLayer.frame = textFrame
    textLayer.shadowColor = UIColor.black.cgColor
    textLayer.shadowRadius = 0.5
    textLayer.shadowOpacity = 0.4
    textLayer.shadowOffset = CGSize(width: 0.0, height: CGFloat(layout.shadowOffsetHeight))
    textLayer.string = string
    textLayer.alignmentMode = textAlignment.textLayerAlignmentMode()
    textLayer.opacity = 0
    let textAnimation = createTextAnimations(key: key, index: index, duration: duration)
    textLayer.add(textAnimation, forKey: "textLayerAnimation")
    return textLayer
  }

  private func textHorizontalOffset(textWidth: CGFloat, parentLayerWidth parentWidth: CGFloat, textAlignment: CaptionPresetTextAlignment) -> CGFloat {
    switch textAlignment {
    case .center:
      return (parentWidth - textWidth) / 2
    case .left:
      return 0
    case .right:
      return parentWidth - textWidth
    }
  }

  private func createTextAnimations(key _: CaptionStyleImpl.LayerKey, index: Int, duration: CFTimeInterval) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let startIndex = index * 3
//    group.animations = CaptionAnimationBuilder()
//      .insert(FadeInAnimationStep(), at: startIndex)
//      .insert(FadeOutAnimationStep(), at: startIndex + 2)
//      .build()
    
    group.duration = duration
    return group
  }
}
