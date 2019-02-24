import AVFoundation
import UIKit

let DEFAULT_ANIMATION_DURATION: CFTimeInterval = 0.25

class VideoAnimationLayer: CALayer {
  private enum State {
    case playing
    case paused
  }

  private var state: State = .paused

  private var isPaused: Bool {
    guard case .paused = state else {
      return false
    }
    return true
  }

  private var isPlaying: Bool {
    guard case .playing = state else {
      return false
    }
    return true
  }

  private var model: VideoAnimationLayerModel
  private var layout: VideoAnimationLayerLayout

  required init?(coder _: NSCoder) {
    fatalError("init?(coder:) has not been implemented for VideoAnimationLayer")
  }

  override init(layer: Any) {
    guard let layer = layer as? VideoAnimationLayer else {
      fatalError("Incorrect layer class for init(layer:)")
    }
    layout = layer.layout
    model = layer.model
    super.init(layer: layer)
    contentsScale = UIScreen.main.scale
    masksToBounds = true
  }

  init(layout: VideoAnimationLayerLayout, model: VideoAnimationLayerModel) {
    self.layout = layout
    self.model = model
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = true
  }

  public func update(model: VideoAnimationLayerModel, layout: VideoAnimationLayerLayout) {
    self.model = model
    self.layout = layout
    triggerReset()
  }

  private func triggerReset() {
    let mediaTimeBeforeReset = convertTime(CACurrentMediaTime(), from: nil)
    let stateBeforeReset = state
    resetAnimation()
    guard case .playing = stateBeforeReset else {
      return
    }
    resume()
    seekTo(time: mediaTimeBeforeReset)
  }

  public func restart() {
    Debug.log(message: "Restarting animation")
    removeAllAnimations()
    resetAnimation()
    beginTime = convertTime(CACurrentMediaTime(), from: nil)
    if !isPlaying {
      resume()
    }
    seekTo(time: .leastNonzeroMagnitude)
  }

  public func seekTo(time: CFTimeInterval) {
    let stateBeforeReset = state
    Debug.log(format: "Animation seeking to %0.2fs", time)
    removeAllAnimations()
    resetAnimation()
    if case .playing = stateBeforeReset {
      speed = 1
      timeOffset = 0
      beginTime = 0
      beginTime = convertTime(CACurrentMediaTime(), from: nil)
      timeOffset = time
    } else {
      let pausedTimeOffset = timeOffset
      timeOffset = 0
      beginTime = 0
      beginTime = convertTime(CACurrentMediaTime(), from: nil) - pausedTimeOffset
      timeOffset = time
    }
    state = stateBeforeReset
  }

  public func pause() {
    if isPaused {
      return
    }
    Debug.log(message: "Pausing animation")
    state = .paused
    speed = 0
    timeOffset = convertTime(CACurrentMediaTime(), from: nil)
  }

  public func resume() {
    if !isPaused {
      return
    }
    Debug.log(message: "Resuming paused animation")
    let pausedTimeOffset = timeOffset
    speed = 1
    timeOffset = 0
    beginTime = 0
    let timeSincePaused = convertTime(CACurrentMediaTime(), from: nil) - pausedTimeOffset
    beginTime = timeSincePaused
    state = .playing
  }

  private func resetAnimation() {
    Debug.log(message: "Resetting animation")
    sublayers = nil
    pause() // NOTE: Start in a paused state
    let containerLayer = setupTextContainerLayer()
    containerLayer.duration = CFTimeInterval(model.duration)
    switch model.lineStyle {
    case .oneLine:
      setupOneLineTextAnimation(inParentLayer: containerLayer)
      break
    case .twoLines:
      setupTwoLineTextAnimation(inParentLayer: containerLayer)
      break
    }
    guard let firstSegment = model.textSegments.first else {
      return
    }
    let opacityLayer = CALayer()
    opacityLayer.backgroundColor = model.backgroundColor.cgColor
    opacityLayer.masksToBounds = true
    opacityLayer.opacity = 0
    let fadeInAnimation = animateFadeIn(atTime: Double(firstSegment.timestamp))
    opacityLayer.add(fadeInAnimation, forKey: nil)
    opacityLayer.frame = CGRect(x: bounds.minX, y: bounds.minY + bounds.height - CGFloat(layout.frameHeight), width: bounds.width, height: CGFloat(layout.frameHeight))
    opacityLayer.addSublayer(containerLayer)
    addSublayer(opacityLayer)
//     TODO: fade out after last segment duration is complete (+delay)
  }

  private func setupOneLineTextAnimation(inParentLayer parentLayer: CALayer) {
    var textLayers = [CATextLayer]()
    model.textSegments.forEach { segment in
      let multiplier = CGFloat(layout.animationMultipler)
      let offset = parentLayer.frame.height * CGFloat(layout.animationOffsetMultiplier)
      let outOfFrameTopY = parentLayer.frame.height * 1.55 * multiplier + offset
      let inFrameMiddleY = parentLayer.frame.height * 0.5 * multiplier + offset
      let outOfFrameBottomY = -parentLayer.frame.height * 0.25 * multiplier + offset
      guard let centerTextLayer = textLayers.last else {
        let textLayer = self.addTextLayer(parent: parentLayer, text: segment.text)
        textLayer.position.y = inFrameMiddleY
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
        return
      }
      let newString = "\(centerTextLayer.string ?? "") \(segment.text)"
      if newString.count > layout.maxCharactersPerLine {
        let timestamp = Double(segment.timestamp) + DEFAULT_ANIMATION_DURATION
        let textLayer = addTextLayer(parent: parentLayer, text: segment.text)
        textLayer.position.y = outOfFrameBottomY
        textLayer.opacity = 0
        let fadeInAnimation = animateFadeIn(atTime: timestamp)
        textLayer.add(fadeInAnimation, forKey: nil)
        let slideUpAnimation = animateSlideUp(fromPosition: textLayer.position, atTime: timestamp, toValue: inFrameMiddleY)
        textLayer.add(slideUpAnimation, forKey: nil)
        let bottomSlideUpAnimation = animateSlideUp(fromPosition: centerTextLayer.position, atTime: timestamp, toValue: outOfFrameTopY)
        centerTextLayer.add(bottomSlideUpAnimation, forKey: nil)
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)

      } else {
        let fadeOutAnimation = animateFadeOut(atTime: Double(segment.timestamp), withDuration: 0)
        centerTextLayer.add(fadeOutAnimation, forKey: nil)
        let textLayer = addTextLayer(parent: parentLayer, text: newString)
        textLayer.position.y = inFrameMiddleY
        textLayer.opacity = 0
        let fadeInAnimation = animateFadeIn(atTime: Double(segment.timestamp), withDuration: 0)
        textLayer.add(fadeInAnimation, forKey: nil)
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
      }
    }
  }

  private func setupTwoLineTextAnimation(inParentLayer parentLayer: CALayer) {
    var textLayers = [CATextLayer]()
    model.textSegments.forEach { segment in
      let multiplier = CGFloat(layout.animationMultipler)
      let offset = parentLayer.frame.height * CGFloat(layout.animationOffsetMultiplier)
      let outOfFrameTopY = parentLayer.frame.height * 1.25 * multiplier + offset
      let inFrameTopY = parentLayer.frame.height * 0.75 * multiplier + offset
      let inFrameMiddleY = parentLayer.frame.height * 0.5 * multiplier + offset
      let inFrameBottomY = parentLayer.frame.height * 0.25 * multiplier + offset
      let outOfFrameBottomY = -parentLayer.frame.height * 0.25 * multiplier + offset
      guard let bottomTextLayer = textLayers.last else {
        let textLayer = self.addTextLayer(parent: parentLayer, text: segment.text)
        textLayer.position.y = inFrameMiddleY
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
        return
      }
      let newString = stringForLine(byJoiningPreviousString: bottomTextLayer.string, withNextString: segment.text)
      if newString.length >= layout.maxCharactersPerLine {
        let textLayer = addTextLayer(parent: parentLayer, text: segment.text)
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
        let textLayer = addTextLayer(parent: parentLayer, text: segment.text)
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
  }

  private func stringForLine(byJoiningPreviousString previousString: Any?, withNextString nextString: String) -> NSAttributedString {
    if let attributedString = previousString as? NSAttributedString {
      let mutableAttributedString = attributedString.mutableCopy() as! NSMutableAttributedString
      mutableAttributedString.mutableString.setString("\(attributedString.string) \(nextString)")
      return mutableAttributedString
    }
    return NSAttributedString(string: previousString as? String ?? "")
  }

  private func setupTextContainerLayer() -> CALayer {
    let containerLayer = CALayer()
    containerLayer.contentsScale = UIScreen.main.scale
    let paddingHorizontal = CGFloat(layout.containerPaddingHorizontal)
    let paddingVertical = CGFloat(layout.containerPaddingVertical)
    let height = CGFloat(layout.textHeight)
    let width = frame.width - paddingHorizontal * 2
    containerLayer.frame = CGRect(x: paddingHorizontal, y: paddingVertical, width: width, height: CGFloat(height))
    return containerLayer
  }

  private func animateFadeIn(atTime beginTime: CFTimeInterval, withDuration duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION) -> CABasicAnimation {
    let fadeInAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    fadeInAnimation.fromValue = 0.0
    fadeInAnimation.toValue = 1.0
    fadeInAnimation.fillMode = .forwards
    fadeInAnimation.isRemovedOnCompletion = false
    fadeInAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    fadeInAnimation.duration = duration
    fadeInAnimation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    return fadeInAnimation
  }

  private func animateFadeOut(atTime beginTime: CFTimeInterval, withDuration duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION) -> CABasicAnimation {
    let fadeOutAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    fadeOutAnimation.toValue = 0.0
    fadeOutAnimation.fillMode = .forwards
    fadeOutAnimation.isRemovedOnCompletion = false
    if duration < 0.25 {
      fadeOutAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime - duration
      fadeOutAnimation.duration = 0.25
    } else {
      fadeOutAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
      fadeOutAnimation.duration = duration
    }
    fadeOutAnimation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    return fadeOutAnimation
  }

  private func animateSlideUp(
    fromPosition position: CGPoint,
    atTime beginTime: CFTimeInterval,
    toValue value: CGFloat,
    withDuration duration: CFTimeInterval = DEFAULT_ANIMATION_DURATION
  ) -> CABasicAnimation {
    let slideUpAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.position))
    slideUpAnimation.toValue = CGPoint(x: position.x, y: value)
    slideUpAnimation.fillMode = .forwards
    slideUpAnimation.isRemovedOnCompletion = false
    if duration < 0.25 {
      slideUpAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime - duration
      slideUpAnimation.duration = 0.25
    } else {
      slideUpAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
      slideUpAnimation.duration = duration
    }
    slideUpAnimation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    return slideUpAnimation
  }

  private func addTextLayer(parent: CALayer, text: String) -> CATextLayer {
    let textLayer = CATextLayer()
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.allowsFontSubpixelQuantization = true
    textLayer.allowsEdgeAntialiasing = true
    let lineHeight = CGFloat(layout.textLineHeight)
    textLayer.frame = CGRect(x: 0, y: CGFloat(layout.textPaddingVertical), width: parent.frame.width, height: lineHeight)
    let fontSize = CGFloat(layout.fontSize)
    let font = UIFont(name: model.fontFamily, size: fontSize) ?? UIFont.systemFont(ofSize: fontSize)
    let paragraphStyle = NSMutableParagraphStyle()
    paragraphStyle.lineHeightMultiple = 1.2
    let attributes: [NSAttributedString.Key: Any] = [
      .foregroundColor: model.textColor.cgColor,
      .font: font,
      .baselineOffset: -abs(fontSize - lineHeight) + (fontSize / 3),
      .paragraphStyle: paragraphStyle,
    ]
    textLayer.shadowColor = UIColor.black.cgColor
    textLayer.shadowRadius = 0.5
    textLayer.shadowOpacity = 0.4
    textLayer.shadowOffset = CGSize(width: 0.0, height: CGFloat(layout.shadowOffsetHeight))
    textLayer.string = NSAttributedString(string: text, attributes: attributes)
    parent.addSublayer(textLayer)
    return textLayer
  }
}
