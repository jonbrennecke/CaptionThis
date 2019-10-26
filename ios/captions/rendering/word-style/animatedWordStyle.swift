import AVFoundation
import UIKit

fileprivate let ANIM_FADE_IN_OUT_DURATION = CFTimeInterval(0.25)

func makeAnimatedWordStyleLayer(
  within bounds: CGRect,
  key: CaptionRowKey,
  segments: [CaptionStringSegment],
  map: CaptionStringsMap,
  style: CaptionStyle,
  duration: CFTimeInterval
) -> CALayer {
  let str = string(from: segments)
  let attributedString = NSAttributedString(string: str, attributes: stringAttributes(for: style))
  let whitespaceCharacterSize = stringSize(matchingAttributesOf: attributedString, string: " ")
  let textSize = attributedString.size()
  let textYOffset = (bounds.height - textSize.height) / 2
  let textXOffset = textHorizontalOffset(textWidth: textSize.width, parentLayerWidth: bounds.width, textAlignment: style.textAlignment)
  let textFrame = CGRect(origin: CGPoint(x: textXOffset, y: textYOffset), size: textSize)
  let parentLayer = CenteredTextLayer()
  parentLayer.contentsScale = UIScreen.main.scale
  parentLayer.frame = textFrame
  var xOffsetAcc = CGFloat(0)
  for segment in segments {
    let substringNaturalSize = segment.data.size()
    let substringSize = CGSize(width: substringNaturalSize.width + 5, height: substringNaturalSize.height)
    let textLayer = CATextLayer()
    textLayer.frame = CGRect(origin: CGPoint(x: style.textAlignment == .center ? xOffsetAcc - 2.5 : xOffsetAcc, y: 0), size: substringSize)
    xOffsetAcc += substringNaturalSize.width + whitespaceCharacterSize.width
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.allowsFontSubpixelQuantization = true
    textLayer.allowsEdgeAntialiasing = true
    textLayer.shadowColor = UIColor.black.cgColor
    textLayer.shadowRadius = textSize.height / 25 * 0.5
    textLayer.shadowOpacity = 0.4
    textLayer.shadowOffset = CGSize(width: 0.0, height: textSize.height / 25)
    textLayer.string = segment.data
    textLayer.alignmentMode = style.textAlignment.textLayerAlignmentMode()
    textLayer.displayIfNeeded()
    textLayer.layoutIfNeeded()
    parentLayer.addSublayer(textLayer)
    textLayer.opacity = 0
    let wordAnimations = createWordAnimations(
      timestamp: segment.timestamp,
      duration: duration
    )
    textLayer.add(wordAnimations, forKey: "textLayerWordAnimation")
  }
  parentLayer.opacity = 0
  let textAnimation = createTextAnimations(map: map, key: key, duration: duration)
  parentLayer.removeAnimation(forKey: "textLayerLineAnimation")
  parentLayer.add(textAnimation, forKey: "textLayerLineAnimation")
  return parentLayer
}

fileprivate func stringSize(matchingAttributesOf attributedString: NSAttributedString, string: String) -> CGSize {
  if attributedString.length == 0 {
    return .zero
  }
  let range = NSRange(location: 0, length: attributedString.length)
  let stringAttributes = attributedString.attributes(at: 0, longestEffectiveRange: nil, in: range)
  let whiteSpaceString = NSAttributedString(string: string, attributes: stringAttributes)
  return whiteSpaceString.size()
}

fileprivate func textHorizontalOffset(
  textWidth: CGFloat,
  parentLayerWidth parentWidth: CGFloat,
  textAlignment: CaptionTextAlignment
) -> CGFloat {
  switch textAlignment {
  case .center:
    return (parentWidth - textWidth) / 2
  case .left:
    return 0
  case .right:
    return parentWidth - textWidth
  }
}

fileprivate func createTextAnimations(map: CaptionStringsMap, key: CaptionRowKey, duration: CFTimeInterval) -> CAAnimationGroup {
  let animations = [
    CaptionAnimation(
      animationsIn: [FadeInAnimationStep()],
      animationsCenter: [],
      animationsOut: [FadeOutAnimationStep()],
      index: key.index,
      key: key
    ),
  ]
  let group = CAAnimationGroup()
  group.repeatCount = .greatestFiniteMagnitude
  group.animations = build(animations: animations, withMap: map)
  group.duration = duration
  group.isRemovedOnCompletion = false
  group.fillMode = .forwards
  group.beginTime = AVCoreAnimationBeginTimeAtZero
  return group
}

fileprivate func createWordAnimations(timestamp: CFTimeInterval, duration: CFTimeInterval) -> CAAnimationGroup {
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
