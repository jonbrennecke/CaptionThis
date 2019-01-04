import AVFoundation
import UIKit

let MAX_CHARACTERS_PER_LINE: Int = 40

class VideoAnimation {
  
  private let containerOffsetFromBottom: CGFloat = 120
  private let containerHeight: CGFloat = 200
  private let paddingHorizontal: CGFloat = 20
  private let fontSize: CGFloat = 60
  
  public let containerLayer = CALayer()
  
  init() {
    containerLayer.masksToBounds = true
  }
  
  public func animate(withParams params: VideoAnimationParams) -> CALayer {
    containerLayer.backgroundColor = params.backgroundColor?.cgColor
    var textLayers = [CATextLayer]()
    params.textSegments?.forEach { segment in
      let outOfFrameTopY = containerLayer.frame.height * 1.25
      let inFrameTopY = containerLayer.frame.height * 0.75
      let inFrameMiddleY = containerLayer.frame.height * 0.5
      let inFrameBottomY = containerLayer.frame.height * 0.25
      let outOfFrameBottomY = -containerLayer.frame.height * 0.25
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
      }
      else {
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
      return containerLayer
    }
    containerLayer.opacity = 0.0
    let animationIn = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    animationIn.fromValue = 0.0
    animationIn.toValue = 1.0
    animationIn.fillMode = .forwards
    animationIn.isRemovedOnCompletion = false
    animationIn.beginTime = AVCoreAnimationBeginTimeAtZero + Double(firstSegment.timestamp)
    animationIn.duration = 0.3
    containerLayer.add(animationIn, forKey: nil)
    // TODO fade out after last segment duration is complete (+delay)
    return containerLayer
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
    let height = containerLayer.frame.height / 2
    let width = containerLayer.frame.width - paddingHorizontal
    textLayer.frame = CGRect(x: paddingHorizontal, y: 0, width: width, height: height)
    textLayer.alignmentMode = .left
    textLayer.fontSize = fontSize
    textLayer.truncationMode = .start
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.font = params.fontFamily as CFTypeRef
    textLayer.foregroundColor = params.textColor?.cgColor
    textLayer.string = text
    containerLayer.addSublayer(textLayer)
    return textLayer
  }
}
