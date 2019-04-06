import UIKit

fileprivate let ANIM_FADE_IN_OUT_DURATION = CFTimeInterval(0.25)

class CaptionPresetAnimatedWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .animated

  func applyWordStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, map: CaptionStringsMap, layout: VideoAnimationLayerLayout, duration: CFTimeInterval) {
    layer.sublayers = nil
    let sublayer = CALayer()
    let bounds = CaptionSizingUtil.layoutForText(originalBounds: layer.bounds, textAlignment: textAlignment)
    sublayer.anchorPoint = bounds.anchorPoint
    sublayer.position = bounds.position
    sublayer.bounds = bounds.toBounds
    let lines = map.getValues(byKey: key)!
    for (index, line) in lines.enumerated() {
      let textLayer = CaptionPresetAnimatedWordStyleImpl.createTextLayer(
        key: key,
        taggedLine: line,
        map: map,
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

  private static func createTextLayer(
    key: CaptionStyleImpl.LayerKey,
    taggedLine: CaptionStringsMap.TaggedLine,
    map: CaptionStringsMap,
    index: Int,
    parentLayer: CALayer,
    layout: VideoAnimationLayerLayout,
    textAlignment: CaptionPresetTextAlignment,
    duration: CFTimeInterval
  ) -> CALayer {
    let attributedString = taggedLine.string.attributedString
    let whitespaceCharacterSize = stringSize(matchingAttributesOf: attributedString, string: " ")
    let textSize = attributedString.size()
    let textYOffset = (parentLayer.frame.height - textSize.height) / 2
    let textXOffset = textHorizontalOffset(textWidth: textSize.width, parentLayerWidth: parentLayer.frame.width, textAlignment: textAlignment)
    let textFrame = CGRect(origin: CGPoint(x: textXOffset, y: textYOffset), size: textSize)
    let parentLayer = CALayer()
    parentLayer.contentsScale = UIScreen.main.scale
    parentLayer.frame = textFrame
    var xOffsetAcc = CGFloat(0)
    for substring in taggedLine.substrings {
      let substringSize = substring.attributedString.size()
      let textLayer = CATextLayer()
      textLayer.frame = CGRect(origin: CGPoint(x: xOffsetAcc, y: 0), size: substringSize)
      xOffsetAcc += substringSize.width + whitespaceCharacterSize.width
      textLayer.contentsScale = UIScreen.main.scale
      textLayer.allowsFontSubpixelQuantization = true
      textLayer.allowsEdgeAntialiasing = true
      textLayer.shadowColor = UIColor.black.cgColor
      textLayer.shadowRadius = 0.5
      textLayer.shadowOpacity = 0.4
      textLayer.shadowOffset = CGSize(width: 0.0, height: CGFloat(layout.shadowOffsetHeight))
      textLayer.string = substring.attributedString
      textLayer.alignmentMode = textAlignment.textLayerAlignmentMode()
      parentLayer.addSublayer(textLayer)
      textLayer.opacity = 0
      let wordAnimations = createWordAnimations(key: key, index: index, timestamp: substring.timestamp, duration: duration)
      textLayer.add(wordAnimations, forKey: "textLayerWordAnimation")
    }
    parentLayer.opacity = 0
    let textAnimation = createTextAnimations(map: map, key: key, index: index, duration: duration)
    parentLayer.add(textAnimation, forKey: "textLayerLineAnimation")
    return parentLayer
  }

  private static func stringSize(matchingAttributesOf attributedString: NSAttributedString, string: String) -> CGSize {
    if attributedString.length == 0 {
      return .zero
    }
    let range = NSRange(location: 0, length: attributedString.length)
    let stringAttributes = attributedString.attributes(at: 0, longestEffectiveRange: nil, in: range)
    let whiteSpaceString = NSAttributedString(string: string, attributes: stringAttributes)
    return whiteSpaceString.size()
  }

  private static func textHorizontalOffset(textWidth: CGFloat, parentLayerWidth parentWidth: CGFloat, textAlignment: CaptionPresetTextAlignment) -> CGFloat {
    switch textAlignment {
    case .center:
      return (parentWidth - textWidth) / 2
    case .left:
      return 0
    case .right:
      return parentWidth - textWidth
    }
  }

  private static func createTextAnimations(map: CaptionStringsMap, key: CaptionStyleImpl.LayerKey, index: Int, duration: CFTimeInterval) -> CAAnimationGroup {
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
    return group
  }

  private static func createWordAnimations(key: CaptionStyleImpl.LayerKey, index: Int, timestamp: CFTimeInterval, duration: CFTimeInterval) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.duration = duration
    let beginTime = clamp(timestamp - ANIM_FADE_IN_OUT_DURATION, from: 0, to: timestamp)
    group.animations = [
      AnimationUtil.fadeIn(at: beginTime, duration: ANIM_FADE_IN_OUT_DURATION),
    ]
    return group
  }
}
