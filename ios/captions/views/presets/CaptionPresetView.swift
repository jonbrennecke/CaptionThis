import UIKit

@objc
class CaptionPresetView: UIView {
  private var presetLayer: CaptionPresetLayer!

  private var style = CaptionPresetStyle(
    wordStyle: .none,
    lineStyle: .fadeInOut,
    textAlignment: .left,
    backgroundStyle: .solid,
    backgroundColor: .white,
    font: UIFont.systemFont(ofSize: 7),
    textColor: UIColor.white
  ) {
    didSet {
      updatePresetLayer()
    }
  }

  @objc
  public var textAlignment: CaptionTextAlignment {
    get {
      return style.textAlignment
    }
    set {
      style = CaptionPresetStyle(
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
      style = CaptionPresetStyle(
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
      style = CaptionPresetStyle(
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
      style = CaptionPresetStyle(
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
      style = CaptionPresetStyle(
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
      updatePresetLayer()
    }
  }

  @objc
  public var textSegments = [CaptionTextSegment]() {
    didSet {
      updatePresetLayer()
    }
  }

  private func updatePresetLayer() {
    presetLayer.frame = bounds
    layer.sublayers = nil
    layer.addSublayer(presetLayer)
  }

  private static let captionPresetFixedSize = CGSize(width: 75, height: 75)

  private func render() {
    // sanity check to fix a bug in renderCaptions, but there's probably a better way of doing this
    if frame == .zero {
      return
    }
    renderCaptions(
      layer: presetLayer,
      style: style,
      textSegments: textSegments,
      duration: duration,
      backgroundHeight: Float(presetLayer.bounds.height)
    )
  }

  // MARK: UIView method implementations

  init() {
    super.init(frame: .zero)
    presetLayer = CaptionPresetLayer()
    updatePresetLayer()
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func didMoveToSuperview() {
    super.didMoveToSuperview()
    render()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    presetLayer?.frame = bounds
    render()
  }
}
