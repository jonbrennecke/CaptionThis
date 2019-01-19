import AVFoundation
import UIKit

let MAX_CHARACTERS_PER_LINE: Int = 32
let DEFAULT_FONT_SIZE: Float = 16

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
  private let containerPaddingHorizontal: CGFloat = 25
  private let containerPaddingVertical: CGFloat = 15
  private let textPaddingHorizontal: CGFloat = 0
  private let textPaddingVertical: CGFloat = 10
  private let extraTextSpaceBottom: CGFloat = 15
  private let fontSize: CGFloat = 17
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
    let containerLayer = setupContainerLayer()
    containerLayer.duration = params.duration?.doubleValue ?? 0
    containerLayer.repeatCount = .greatestFiniteMagnitude // TODO: necessary or not?
    var textLayers = [CATextLayer]()
    params.textSegments?.forEach { segment in
      let multiplier: CGFloat = outputKind == .view ? -1 : 1
      let offset: CGFloat = outputKind == .view ? containerLayer.frame.height : 0
      let outOfFrameTopY = containerLayer.frame.height * 1.25 * multiplier + offset
      let inFrameTopY = containerLayer.frame.height * 0.75 * multiplier + offset
      let inFrameMiddleY = containerLayer.frame.height * 0.5 * multiplier + offset
      let inFrameBottomY = containerLayer.frame.height * 0.25 * multiplier + offset
      let outOfFrameBottomY = -containerLayer.frame.height * 0.25 * multiplier + offset
      guard let bottomTextLayer = textLayers.last else {
        let textLayer = self.addTextLayer(parent: containerLayer, withParams: params, text: segment.text)
        textLayer.position.y = inFrameMiddleY
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
        return
      }
      let newString = "\(bottomTextLayer.string ?? "") \(segment.text)"
      if newString.count >= MAX_CHARACTERS_PER_LINE {
        let textLayer = addTextLayer(parent: containerLayer, withParams: params, text: segment.text)
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
        let textLayer = addTextLayer(parent: containerLayer, withParams: params, text: segment.text)
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
    let opacityLayer = CALayer()
    opacityLayer.backgroundColor = params.backgroundColor?.withAlphaComponent(0.8).cgColor
    opacityLayer.opacity = 0
    let fadeInAnimation = animateFadeIn(atTime: Double(firstSegment.timestamp))
    opacityLayer.add(fadeInAnimation, forKey: nil)
    opacityLayer.frame = bounds
    opacityLayer.addSublayer(containerLayer)
    addSublayer(opacityLayer)
//     TODO: fade out after last segment duration is complete (+delay)
  }

  private func setupContainerLayer() -> CALayer {
    let containerLayer = CALayer()
    containerLayer.contentsScale = UIScreen.main.scale
    let multiplier: CGFloat = outputKind == .export ? 3 : 1
    let paddingHorizontal = containerPaddingHorizontal * multiplier
    let paddingVertical = containerPaddingVertical * multiplier
    let height = frame.height - paddingVertical * 2
    let width = frame.width - paddingHorizontal * 2
    containerLayer.frame = CGRect(x: paddingHorizontal, y: paddingVertical, width: width, height: height)
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

  private func addTextLayer(parent: CALayer, withParams params: VideoAnimationParams, text: String) -> CATextLayer {
    let textLayer = CenteredTextLayer()
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.allowsFontSubpixelQuantization = true
    textLayer.allowsEdgeAntialiasing = true
    let multiplier: CGFloat = outputKind == .export ? 1 : 1
    let paddingHorizontal = textPaddingHorizontal * multiplier
    let paddingVertical = textPaddingVertical * multiplier
    let height = parent.frame.height / 2
    let width = parent.frame.width
    textLayer.frame = CGRect(x: paddingHorizontal, y: paddingVertical, width: width, height: height)
    textLayer.alignmentMode = .left
    let fontSizeMultiplier = outputKind == .export ? UIScreen.main.scale : 1
    let fontSize = CGFloat(params.fontSize?.floatValue ?? DEFAULT_FONT_SIZE)
    textLayer.fontSize = fontSize * fontSizeMultiplier
    textLayer.truncationMode = .start
    textLayer.font = params.fontFamily as CFTypeRef
    textLayer.foregroundColor = params.textColor?.cgColor
    textLayer.string = text
    parent.addSublayer(textLayer)
    return textLayer
  }
}
