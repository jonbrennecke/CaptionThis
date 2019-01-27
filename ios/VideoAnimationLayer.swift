import AVFoundation
import UIKit

let MAX_CHARACTERS_PER_LINE: Int = 32
let DEFAULT_ANIMATION_DURATION: CFTimeInterval = 0.25

@objc
enum VideoAnimationOutputKind: Int {
  case export
  case view
}

enum VideoAnimationPlaybackState {
  case playing
  case paused
  case none
}

@objc
class VideoAnimationLayer: CALayer {
  private var outputKind: VideoAnimationOutputKind = .view
  private var playbackState: VideoAnimationPlaybackState = .none

  private var isPaused: Bool {
    return playbackState == .paused
  }

  private var isPlaying: Bool {
    return playbackState == .playing
  }

  @objc
  public var params: VideoAnimationParams = VideoAnimationParams() {
    didSet {
      let stateBeforeReset = playbackState
      resetAnimation()
      if stateBeforeReset == .playing {
        resume()
      }
    }
  }

  required init?(coder _: NSCoder) {
    fatalError("init?(coder:) has not been implemented for VideoAnimationLayer")
  }

  @objc
  override init() {
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = true
  }

  @objc
  convenience init(for outputKind: VideoAnimationOutputKind) {
    self.init()
    self.outputKind = outputKind
  }

  @objc
  public func restart() {
    Debug.log(message: "Restarting animation")
    removeAllAnimations()
    resetAnimation()
    beginTime = convertTime(CACurrentMediaTime(), from: nil)
    if playbackState != .playing {
      resume()
    }
  }

  @objc
  public func seekTo(time: Double) {
    Debug.log(format: "Animation seeking to %0.5f", time)
    removeAllAnimations()
    resetAnimation()
    if playbackState != .playing {
      resume()
    }
    timeOffset = time
  }

  @objc
  public func pause() {
    if playbackState == .paused {
      return
    }
    Debug.log(message: "Pausing animation")
    playbackState = .paused
    speed = 0
    timeOffset = convertTime(CACurrentMediaTime(), from: nil)
  }

  @objc
  public func resume() {
    if playbackState != .paused {
      return
    }
    Debug.log(message: "Resuming paused animation")
    let pausedTimeOffset = timeOffset
    speed = 1
    timeOffset = 0
    beginTime = 0
    let timeSincePaused = convertTime(CACurrentMediaTime(), from: nil) - pausedTimeOffset
    beginTime = timeSincePaused
    playbackState = .playing
  }

  private func resetAnimation() {
    Debug.log(message: "Resetting animation")
    sublayers = nil
    pause() // NOTE: Start in a paused state
    let containerLayer = setupTextContainerLayer()
    containerLayer.duration = params.duration?.doubleValue ?? 0
    switch params.lineStyle {
    case .oneLine:
      setupOneLineTextAnimation(inParentLayer: containerLayer)
      break
    case .twoLines:
      setupTwoLineTextAnimation(inParentLayer: containerLayer)
      break
    }
    guard let firstSegment = params.textSegments?.first else {
      return
    }
    let opacityLayer = CALayer()
    opacityLayer.backgroundColor = params.backgroundColor?.withAlphaComponent(0.8).cgColor
    opacityLayer.masksToBounds = true
    opacityLayer.opacity = 0
    let fadeInAnimation = animateFadeIn(atTime: Double(firstSegment.timestamp))
    opacityLayer.add(fadeInAnimation, forKey: nil)
    let height = params.frameHeight(forOutputKind: outputKind)
    opacityLayer.frame = CGRect(x: bounds.minX, y: bounds.minY + bounds.height - CGFloat(height), width: bounds.width, height: CGFloat(height))
    opacityLayer.addSublayer(containerLayer)
    addSublayer(opacityLayer)
//     TODO: fade out after last segment duration is complete (+delay)
  }

  private func setupOneLineTextAnimation(inParentLayer parentLayer: CALayer) {
    var textLayers = [CATextLayer]()
    params.textSegments?.forEach { segment in
      let multiplier: CGFloat = outputKind == .view ? -1 : 1
      let offset: CGFloat = outputKind == .view ? parentLayer.frame.height : 0
      let outOfFrameTopY = parentLayer.frame.height * 1.55 * multiplier + offset
      let inFrameMiddleY = parentLayer.frame.height * 0.5 * multiplier + offset
      let outOfFrameBottomY = -parentLayer.frame.height * 0.25 * multiplier + offset
      guard let centerTextLayer = textLayers.last else {
        let textLayer = self.addTextLayer(parent: parentLayer, withParams: params, text: segment.text)
        textLayer.position.y = inFrameMiddleY
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
        return
      }
      let newString = "\(centerTextLayer.string ?? "") \(segment.text)"
      if newString.count > MAX_CHARACTERS_PER_LINE {
        let timestamp = Double(segment.timestamp) + DEFAULT_ANIMATION_DURATION
        let textLayer = addTextLayer(parent: parentLayer, withParams: params, text: segment.text)
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
        let textLayer = addTextLayer(parent: parentLayer, withParams: params, text: newString)
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
    params.textSegments?.forEach { segment in
      let multiplier: CGFloat = outputKind == .view ? -1 : 1
      let offset: CGFloat = outputKind == .view ? parentLayer.frame.height : 0
      let outOfFrameTopY = parentLayer.frame.height * 1.25 * multiplier + offset
      let inFrameTopY = parentLayer.frame.height * 0.75 * multiplier + offset
      let inFrameMiddleY = parentLayer.frame.height * 0.5 * multiplier + offset
      let inFrameBottomY = parentLayer.frame.height * 0.25 * multiplier + offset
      let outOfFrameBottomY = -parentLayer.frame.height * 0.25 * multiplier + offset
      guard let bottomTextLayer = textLayers.last else {
        let textLayer = self.addTextLayer(parent: parentLayer, withParams: params, text: segment.text)
        textLayer.position.y = inFrameMiddleY
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
        return
      }
      let newString = stringForLine(byJoiningPreviousString: bottomTextLayer.string, withNextString: segment.text)
      if newString.length >= MAX_CHARACTERS_PER_LINE {
        let textLayer = addTextLayer(parent: parentLayer, withParams: params, text: segment.text)
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
        let textLayer = addTextLayer(parent: parentLayer, withParams: params, text: segment.text)
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
    let paddingHorizontal = CGFloat(params.containerPaddingHorizontal(forOutputKind: outputKind))
    let paddingVertical = CGFloat(params.containerPaddingVertical(forOutputKind: outputKind))
    let height = params.textHeight(forOutputKind: outputKind)
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
    fadeOutAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    fadeOutAnimation.duration = duration
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
    slideUpAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    slideUpAnimation.duration = duration
    slideUpAnimation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    return slideUpAnimation
  }

  private func addTextLayer(parent: CALayer, withParams params: VideoAnimationParams, text: String) -> CATextLayer {
    let textLayer = CATextLayer()
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.allowsFontSubpixelQuantization = true
    textLayer.allowsEdgeAntialiasing = true
    let lineHeight = CGFloat(params.textLineHeight(forOutputKind: outputKind))
    textLayer.frame = CGRect(x: 0, y: CGFloat(params.textPaddingVertical), width: parent.frame.width, height: lineHeight)
    let fontSize = CGFloat(params.fontSize(forOutputKind: outputKind))
    let font = UIFont(name: params.fontFamily ?? "Helvetica", size: fontSize) ?? UIFont.systemFont(ofSize: fontSize)
    let attributes: [NSAttributedString.Key: Any] = [
      .foregroundColor: params.textColor?.cgColor ?? UIColor.black.cgColor,
      .font: font,
      .baselineOffset: -abs(fontSize - lineHeight) + (fontSize / 3)
    ]
    textLayer.shadowColor = UIColor.black.cgColor
    textLayer.shadowRadius = 0.5
    textLayer.shadowOpacity = 0.25
    textLayer.shadowOffset = CGSize(width: 0.0, height: 1.0)
    textLayer.string = NSAttributedString(string: text, attributes: attributes)
    parent.addSublayer(textLayer)
    return textLayer
  }
}
