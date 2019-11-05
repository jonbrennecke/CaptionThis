import AVFoundation
import UIKit

fileprivate let ANIM_FADE_IN_OUT_DURATION = CFTimeInterval(0.25)

func makeWordStyleLayer(
  within bounds: CGRect,
  stringSegments: [CaptionStringSegment],
  style: CaptionStyle,
  duration: CFTimeInterval
) -> CALayer {
  switch style.wordStyle {
  case .animated:
    return makeAnimatedWordStyleLayer(
      captionStyle: style,
      within: bounds,
      segments: stringSegments,
      style: style,
      duration: duration
    )
  default:
    return makeDefaultTextStyleLayer(
      captionStyle: style,
      within: bounds,
      style: style,
      stringSegments: stringSegments
    )
  }
}

func makeDefaultTextStyleLayer(
  captionStyle: CaptionStyle,
  within bounds: CGRect,
  style: CaptionStyle,
  stringSegments: [CaptionStringSegment]
) -> CALayer {
  let segmentString = string(from: stringSegments)
  let attributes = stringAttributes(for: style)
  let attributedString = NSAttributedString(string: segmentString, attributes: attributes)
  let textLayer = createTextLayer(
    captionStyle: captionStyle,
    within: bounds,
    attributedString: attributedString,
    textAlignment: style.textStyle.alignment
  )
  textLayer.displayIfNeeded()
  textLayer.layoutIfNeeded()
  return textLayer
}

fileprivate func createTextLayer(
  captionStyle: CaptionStyle,
  within bounds: CGRect,
  attributedString: NSAttributedString,
  textAlignment: CaptionStyle.TextStyle.Alignment
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
  textLayer.shadowColor = captionStyle.textStyle.shadow.color.cgColor
  textLayer.shadowRadius = textSize.height / 25 * 0.5
  textLayer.shadowOpacity = captionStyle.textStyle.shadow.opacity
  textLayer.shadowOffset = CGSize(width: 0.0, height: textSize.height / 25)
  textLayer.string = attributedString
  textLayer.alignmentMode = textAlignment.textLayerAlignmentMode()
  return textLayer
}

func makeAnimatedWordStyleLayer(
  captionStyle: CaptionStyle,
  within bounds: CGRect,
  segments: [CaptionStringSegment],
  style: CaptionStyle,
  duration: CFTimeInterval
) -> CALayer {
  let str = string(from: segments)
  let attributedString = NSAttributedString(string: str, attributes: stringAttributes(for: style))
  let whitespaceCharacterSize = stringSize(matchingAttributesOf: attributedString, string: " ")
  let textSize = attributedString.size()
  let textYOffset = (bounds.height - textSize.height) / 2
  let textXOffset = textHorizontalOffset(
    textWidth: textSize.width,
    parentLayerWidth: bounds.width,
    textAlignment: style.textStyle.alignment
  )
  let textFrame = CGRect(origin: CGPoint(x: textXOffset, y: textYOffset), size: textSize)
  let parentLayer = CenteredTextLayer()
  parentLayer.contentsScale = UIScreen.main.scale
  parentLayer.frame = textFrame
  var xOffsetAcc = CGFloat(0)
  for segment in segments {
    let substringNaturalSize = segment.data.size()
    let substringSize = CGSize(width: substringNaturalSize.width + 5, height: substringNaturalSize.height)
    let textLayer = CATextLayer()
    textLayer.frame = CGRect(
      origin: CGPoint(x: style.textStyle.alignment == .center ? xOffsetAcc - 2.5 : xOffsetAcc, y: 0),
      size: substringSize
    )
    xOffsetAcc += substringNaturalSize.width + whitespaceCharacterSize.width
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.allowsFontSubpixelQuantization = true
    textLayer.allowsEdgeAntialiasing = true
    textLayer.shadowColor = captionStyle.textStyle.shadow.color.cgColor
    textLayer.shadowRadius = textSize.height / 25 * 0.5
    textLayer.shadowOpacity = captionStyle.textStyle.shadow.opacity
    textLayer.shadowOffset = CGSize(width: 0.0, height: textSize.height / 25)
    textLayer.string = segment.data
    textLayer.alignmentMode = style.textStyle.alignment.textLayerAlignmentMode()
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
  textAlignment: CaptionStyle.TextStyle.Alignment
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
