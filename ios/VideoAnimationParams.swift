import Foundation

let DEFAULT_FONT_SIZE: Float = 16

@objc
enum VideoAnimationLineStyle: Int {
  case oneLine = 1
  case twoLines = 2
}

@objc
class VideoAnimationParams: NSObject {
  @objc
  public var orientation: UIImage.Orientation = .up
  @objc
  public var textSegments: [TextSegmentParams]?
  @objc
  public var fontFamily: String?
  @objc
  public var fontSize: NSNumber?
  @objc
  public var backgroundColor: UIColor?
  @objc
  public var textColor: UIColor?
  @objc
  public var playbackTime: NSNumber?
  @objc
  public var duration: NSNumber?
  @objc
  public var lineStyle: VideoAnimationLineStyle = .twoLines

  public func containerPaddingHorizontal(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    return (outputKind == .view ? 10 : 45) * orientationMultipler(forOutputKind: outputKind)
  }

  public func containerPaddingVertical(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    return (outputKind == .view ? 5 : 15) * orientationMultipler(forOutputKind: outputKind)
  }

  public func textPaddingVertical(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    return 5 * orientationMultipler(forOutputKind: outputKind)
  }

  public func fontSize(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    let fontSizeMultiplier = outputKind == .export ? Float(UIScreen.main.scale) : 1
    return (fontSize?.floatValue ?? DEFAULT_FONT_SIZE) * fontSizeMultiplier * orientationMultipler(forOutputKind: outputKind)
  }

  public func textLineHeight(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    let fontSize = self.fontSize(forOutputKind: outputKind)
    return fontSize * 1.50
  }

  public func textHeight(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    let lineMultiplier: Float = lineStyle == .oneLine ? 1.0 : 2.0
    return textLineHeight(forOutputKind: outputKind) * lineMultiplier + textPaddingVertical(forOutputKind: outputKind) * 2
  }

  public func frameHeight(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    return textHeight(forOutputKind: outputKind) + containerPaddingVertical(forOutputKind: outputKind) * 2
  }

  private func orientationMultipler(forOutputKind outputKind: VideoAnimationOutputKind) -> Float {
    if outputKind == .export {
      return 1
    }
    return OrientationUtil.isLandscape(orientation: orientation) ? 9.0 / 16.0 : 1
  }
}

@objc
class TextSegmentParams: NSObject {
  let duration: Float
  let timestamp: Float
  let text: String

  @objc
  init(text: String, duration: Float, timestamp: Float) {
    self.duration = duration
    self.timestamp = timestamp
    self.text = text
  }
}
