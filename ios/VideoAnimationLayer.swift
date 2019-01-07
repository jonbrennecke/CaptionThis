import AVFoundation
import UIKit

let MAX_CHARACTERS_PER_LINE: Int = 25

@objc
enum VideoAnimationOutputKind: Int {
  case export
  case view
}

@objc
class VideoAnimationLayer: CALayer {
  private let paddingHorizontal: CGFloat = 40
  private let fontSize: CGFloat = 23
  private let outputKind: VideoAnimationOutputKind

  required init?(coder _: NSCoder) {
    fatalError("init?(coder:) has not been implemented for VideoAnimationLayer")
  }

  @objc
  init(for outputKind: VideoAnimationOutputKind) {
    self.outputKind = outputKind
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = true
    opacity = 0.0
    rasterizationScale = UIScreen.main.scale
    shouldRasterize = true
  }

  @objc
  public func animate(withParams params: VideoAnimationParams) {
    backgroundColor = params.backgroundColor?.cgColor
    var textLayers = [CATextLayer]()
    params.textSegments?.forEach { segment in
      let multiplier: CGFloat = outputKind == .view ? -1 : 1
      let offset: CGFloat = outputKind == .view ? frame.height : 0
      let outOfFrameTopY = frame.height * 1.25 * multiplier + offset
      let inFrameTopY = frame.height * 0.75 * multiplier + offset
      let inFrameMiddleY = frame.height * 0.5 * multiplier + offset
      let inFrameBottomY = frame.height * 0.25 * multiplier + offset
      let outOfFrameBottomY = -frame.height * 0.25 * multiplier + offset
      guard let bottomTextLayer = textLayers.last else {
        let textLayer = self.addTextLayer(withParams: params, text: segment.text)
        textLayer.position.y = inFrameMiddleY
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
        return
      }
      let newString = "\(bottomTextLayer.string ?? "") \(segment.text)"
      if newString.count >= MAX_CHARACTERS_PER_LINE {
        let textLayer = addTextLayer(withParams: params, text: segment.text)
        textLayer.position.y = outOfFrameBottomY
        textLayer.opacity = 0
        let fadeInAnimation = animateFadeIn(atTime: Double(segment.timestamp))
        textLayer.add(fadeInAnimation, forKey: nil)
        let slideUpAnimation = animateSlideUp(fromPosition: textLayer.position, atTime: Double(segment.timestamp), toValue: inFrameBottomY)
        textLayer.add(slideUpAnimation, forKey: nil)
        let bottomSlideUpAnimation = animateSlideUp(fromPosition: bottomTextLayer.position, atTime: Double(segment.timestamp), toValue: inFrameTopY)
        bottomTextLayer.add(bottomSlideUpAnimation, forKey: nil)
        textLayers.forEach { layer in
          if layer == bottomTextLayer || layer == textLayer {
            return
          }
          let slideUpAnimation = animateSlideUp(fromPosition: layer.position, atTime: Double(segment.timestamp), toValue: outOfFrameTopY)
          layer.add(slideUpAnimation, forKey: nil)
          let fadeOutAnimation = animateFadeOut(atTime: Double(segment.timestamp))
          layer.add(fadeOutAnimation, forKey: nil)
        }
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
      } else {
        let fadeOutAnimation = animateFadeOut(atTime: Double(segment.timestamp), withDuration: 0)
        bottomTextLayer.add(fadeOutAnimation, forKey: nil)
        let textLayer = addTextLayer(withParams: params, text: segment.text)
        let isMiddle = abs(bottomTextLayer.position.y - inFrameMiddleY) < CGFloat.ulpOfOne
        textLayer.position.y = isMiddle ? inFrameMiddleY : inFrameBottomY
        textLayer.string = newString
        textLayer.opacity = 0
        let fadeInAnimation = animateFadeIn(atTime: Double(segment.timestamp), withDuration: 0)
        textLayer.add(fadeInAnimation, forKey: nil)
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
      }
    }
    guard let firstSegment = params.textSegments?.first else {
      return
    }
    let animationIn = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    animationIn.fromValue = 0.0
    animationIn.toValue = 1.0
    animationIn.fillMode = .forwards
    animationIn.isRemovedOnCompletion = false
    animationIn.beginTime = AVCoreAnimationBeginTimeAtZero + Double(firstSegment.timestamp)
    animationIn.duration = 0.1
    add(animationIn, forKey: nil)
//     TODO: fade out after last segment duration is complete (+delay)
  }

  private func animateFadeIn(atTime beginTime: CFTimeInterval, withDuration duration: CFTimeInterval = 0.25) -> CABasicAnimation {
    let fadeInAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    fadeInAnimation.fromValue = 0.0
    fadeInAnimation.toValue = 1.0
    fadeInAnimation.fillMode = .forwards
    fadeInAnimation.isRemovedOnCompletion = false
    fadeInAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    fadeInAnimation.duration = duration
    return fadeInAnimation
  }

  private func animateFadeOut(atTime beginTime: CFTimeInterval, withDuration duration: CFTimeInterval = 0.25) -> CABasicAnimation {
    let fadeOutAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    fadeOutAnimation.toValue = 0.0
    fadeOutAnimation.fillMode = .forwards
    fadeOutAnimation.isRemovedOnCompletion = false
    fadeOutAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    fadeOutAnimation.duration = duration
    return fadeOutAnimation
  }

  private func animateSlideUp(
    fromPosition position: CGPoint,
    atTime beginTime: CFTimeInterval,
    toValue value: CGFloat,
    withDuration duration: CFTimeInterval = 0.25
  ) -> CABasicAnimation {
    let slideUpAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.position))
    slideUpAnimation.toValue = CGPoint(x: position.x, y: value)
    slideUpAnimation.fillMode = .forwards
    slideUpAnimation.isRemovedOnCompletion = false
    slideUpAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    slideUpAnimation.duration = duration
    return slideUpAnimation
  }

  private func addTextLayer(withParams params: VideoAnimationParams, text: String) -> CATextLayer {
    let textLayer = CenteredTextLayer()
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.allowsFontSubpixelQuantization = true
    let height = frame.height / 2
    let width = frame.width - paddingHorizontal * 2
    textLayer.frame = CGRect(x: paddingHorizontal, y: 0, width: width, height: height)
    textLayer.alignmentMode = .left
    let fontSizeMultiplier = outputKind == .export ? UIScreen.main.scale : 1
    textLayer.fontSize = fontSize * fontSizeMultiplier
    textLayer.truncationMode = .start
    textLayer.font = params.fontFamily as CFTypeRef
    textLayer.foregroundColor = params.textColor?.cgColor
    textLayer.string = text
    addSublayer(textLayer)
    return textLayer
  }
}
