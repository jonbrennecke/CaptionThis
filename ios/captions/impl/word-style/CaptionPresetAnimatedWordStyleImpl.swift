import AVFoundation
import UIKit

fileprivate let ANIM_FADE_IN_OUT_DURATION = CFTimeInterval(0.25)

class CaptionPresetAnimatedWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .animated

  func applyWordStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, map: CaptionStringsMap, duration: CFTimeInterval) {
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
    textAlignment: CaptionPresetTextAlignment,
    duration: CFTimeInterval
  ) -> CALayer {
    let attributedString = taggedLine.string.attributedString
    let whitespaceCharacterSize = stringSize(matchingAttributesOf: attributedString, string: " ")
    let textSize = attributedString.size()
    let textYOffset = (parentLayer.frame.height - textSize.height) / 2
    let textXOffset = textHorizontalOffset(textWidth: textSize.width, parentLayerWidth: parentLayer.frame.width, textAlignment: textAlignment)
    let textFrame = CGRect(origin: CGPoint(x: textXOffset, y: textYOffset), size: textSize)
    let parentLayer = CenteredTextLayer()
    parentLayer.contentsScale = UIScreen.main.scale
    parentLayer.frame = textFrame
    var xOffsetAcc = CGFloat(0)
    for substring in taggedLine.substrings {
      let substringNaturalSize = substring.attributedString.size()
      let substringSize = CGSize(width: substringNaturalSize.width + 5, height: substringNaturalSize.height)
      let textLayer = CATextLayer()
      textLayer.frame = CGRect(origin: CGPoint(x: textAlignment == .center ? xOffsetAcc - 2.5 : xOffsetAcc, y: 0), size: substringSize)
      xOffsetAcc += substringNaturalSize.width + whitespaceCharacterSize.width
      textLayer.contentsScale = UIScreen.main.scale
      textLayer.allowsFontSubpixelQuantization = true
      textLayer.allowsEdgeAntialiasing = true
      textLayer.shadowColor = UIColor.black.cgColor
      textLayer.shadowRadius = 0.5
      textLayer.shadowOpacity = 0.4
      textLayer.shadowOffset = CGSize(width: 0.0, height: 1)
      textLayer.string = substring.attributedString
      textLayer.alignmentMode = textAlignment.textLayerAlignmentMode()
      textLayer.displayIfNeeded()
      textLayer.layoutIfNeeded()
      parentLayer.addSublayer(textLayer)
      textLayer.opacity = 0
      let wordAnimations = createWordAnimations(key: key, index: index, timestamp: substring.timestamp, duration: duration)
      textLayer.add(wordAnimations, forKey: "textLayerWordAnimation")
    }
    parentLayer.opacity = 0
    let textAnimation = createTextAnimations(map: map, key: key, index: index, duration: duration)
    parentLayer.removeAnimation(forKey: "textLayerLineAnimation")
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
    let builder = CaptionAnimation.Builder()
    builder.insert(
      in: [FadeInAnimationStep()],
      center: [],
      out: [FadeOutAnimationStep()],
      index: index,
      key: key
    )
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.animations = builder.build(withMap: map)
    group.duration = duration
    group.isRemovedOnCompletion = false
    group.fillMode = .forwards
    group.beginTime = AVCoreAnimationBeginTimeAtZero
    return group
  }

  private static func createWordAnimations(key _: CaptionStyleImpl.LayerKey, index _: Int, timestamp: CFTimeInterval, duration: CFTimeInterval) -> CAAnimationGroup {
    let beginTime = clamp(timestamp - ANIM_FADE_IN_OUT_DURATION, from: 0, to: timestamp)
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.duration = duration
    group.animations = [
      AnimationUtil.fadeIn(at: beginTime, duration: ANIM_FADE_IN_OUT_DURATION),
    ]
    group.isRemovedOnCompletion = false
    group.fillMode = .forwards
    group.beginTime = AVCoreAnimationBeginTimeAtZero
    return group
  }
}
