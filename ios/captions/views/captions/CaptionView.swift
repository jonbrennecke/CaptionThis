import UIKit

@objc(CaptionView)
class CaptionView: UIView {
  private var captionLayer: CaptionLayer!

  private var style = CaptionStyle(
    wordStyle: .none,
    lineStyle: .fadeInOut,
    textAlignment: .left,
    backgroundStyle: .solid,
    backgroundColor: .white,
    font: UIFont.systemFont(ofSize: 7),
    textColor: UIColor.white
  ) {
    didSet {
      updateCaptionLayer()
    }
  }

  @objc
  public var textAlignment: CaptionPresetTextAlignment {
    get {
      return style.textAlignment
    }
    set {
      style = CaptionStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: newValue,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor,
        font: style.font,
        textColor: style.textColor
      )
    }
  }

  @objc
  public var lineStyle: CaptionLineStyle {
    get {
      return style.lineStyle
    }
    set {
      style = CaptionStyle(
        wordStyle: style.wordStyle,
        lineStyle: newValue,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor,
        font: style.font,
        textColor: style.textColor
      )
    }
  }

  @objc
  public var wordStyle: CaptionWordStyle {
    get {
      return style.wordStyle
    }
    set {
      style = CaptionStyle(
        wordStyle: newValue,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor,
        font: style.font,
        textColor: style.textColor
      )
    }
  }

  @objc
  public var backgroundStyle: CaptionPresetBackgroundStyle {
    get {
      return style.backgroundStyle
    }
    set {
      style = CaptionStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: newValue,
        backgroundColor: style.backgroundColor,
        font: style.font,
        textColor: style.textColor
      )
    }
  }

  @objc
  public var captionBackgroundColor: UIColor {
    get {
      return style.backgroundColor
    }
    set {
      style = CaptionStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: newValue,
        font: style.font,
        textColor: style.textColor
      )
    }
  }

  @objc
  public var textColor: UIColor {
    get {
      return style.textColor
    }
    set {
      style = CaptionStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor,
        font: style.font,
        textColor: newValue
      )
    }
  }

  @objc
  public var duration = CFTimeInterval(0) {
    didSet {
      updateCaptionLayer()
    }
  }

  @objc
  public var viewLayout = CaptionViewLayout.defaultLayout {
    didSet {
      updateCaptionLayer()
    }
  }

  @objc
  public var fontSize: CGFloat {
    get {
      return style.font.pointSize
    }
    set {
      style = CaptionStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor,
        font: style.font.withSize(newValue),
        textColor: style.textColor
      )
    }
  }

  @objc
  public var fontFamily: String {
    get {
      return style.font.familyName
    }
    set {
      style = CaptionStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor,
        font: UIFont(name: newValue, size: fontSize) ?? UIFont.systemFont(ofSize: fontSize),
        textColor: style.textColor
      )
    }
  }

  @objc
  public var textSegments = [CaptionTextSegment]() {
    didSet {
      updateCaptionLayer()
    }
  }

  private func updateCaptionLayer() {
    captionLayer = CaptionLayer(impl: createCaptionStyleImpl())
    captionLayer.frame = bounds
    layer.sublayers = nil
    layer.addSublayer(captionLayer)
  }

  private func createCaptionStyleImpl() -> CaptionStyleImpl {
    return CaptionPresetStyleImplFactory.impl(forStyle: style, textSegments: textSegments, layout: viewLayout, duration: duration)
  }

  // MARK: UIView method implementations

  init() {
    super.init(frame: .zero)
    captionLayer = CaptionLayer(impl: createCaptionStyleImpl())
    captionLayer.frame = bounds
    layer.addSublayer(captionLayer)
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func didMoveToSuperview() {
    super.didMoveToSuperview()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    captionLayer.frame = bounds
  }
}

extension CaptionView: PlaybackControls {
  var playbackLayer: PlaybackControlLayer & CALayer {
    return captionLayer
  }

  @objc
  func resume() {
    playbackLayer.resume()
  }

  @objc
  func pause() {
    playbackLayer.pause()
  }

  @objc
  func restart() {
    playbackLayer.restart()
  }

  @objc
  func seekTo(time: CFTimeInterval) {
    playbackLayer.seekTo(time: time)
  }
}
