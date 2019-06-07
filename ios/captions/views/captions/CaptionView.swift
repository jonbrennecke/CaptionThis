import UIKit

@objc(CaptionView)
class CaptionView: UIView {
  private var rowLayers = CaptionRowLayers()

  internal var state: PlaybackControllerState = .paused

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
      render()
    }
  }

  @objc
  public var textAlignment: CaptionTextAlignment {
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
  public var backgroundStyle: CaptionBackgroundStyle {
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
      render()
    }
  }

  @objc
  public var viewLayout = CaptionViewLayout.defaultLayout {
    didSet {
      render()
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
      render()
    }
  }

  private func render() {
    // sanity check to fix a bug in renderCaptions, but there's probably a better way of doing this
    if frame == .zero {
      return
    }
    layer.sublayers = nil
    rowLayers = CaptionRowLayers()
    rowLayers.each { layer.addSublayer($1) }
    renderCaptions(
      layer: layer,
      rowLayers: rowLayers,
      style: style,
      textSegments: textSegments,
      layout: viewLayout,
      duration: duration
    )
  }

  // MARK: UIView method implementations

  init() {
    super.init(frame: .zero)
    render()
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    render()
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}

extension CaptionView: PlaybackController {
  func resetAnimation() {
    render()
    pause()
  }

  @objc
  func resume() {
    resume(layer: layer)
  }

  @objc
  func pause() {
    pause(layer: layer)
  }

  @objc
  func restart() {
    restart(layer: layer)
  }

  @objc
  func seekTo(time: CFTimeInterval) {
    seekTo(layer: layer, time: time)
  }
}
