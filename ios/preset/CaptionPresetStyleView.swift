import UIKit

@objc
class CaptionPresetStyleView: UIView {
  private var presetLayer: CaptionPresetStyleLayer?

  private var style = CaptionPresetStyle(
    wordStyle: .none,
    lineStyle: .fadeInOut,
    textAlignment: .left,
    backgroundStyle: .solid,
    backgroundColor: .white
  ) {
    didSet {
      presetLayer = CaptionPresetStyleLayer(style: style)
      presetLayer!.frame = bounds
      layer.sublayers = nil
      layer.addSublayer(presetLayer!)
    }
  }

  @objc
  public var textAlignment: CaptionPresetTextAlignment {
    get {
      return style.textAlignment
    }
    set {
      style = CaptionPresetStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: newValue,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor
      )
    }
  }

  @objc
  public var lineStyle: CaptionPresetLineStyle {
    get {
      return style.lineStyle
    }
    set {
      style = CaptionPresetStyle(
        wordStyle: style.wordStyle,
        lineStyle: newValue,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor
      )
    }
  }

  @objc
  public var wordStyle: CaptionPresetWordStyle {
    get {
      return style.wordStyle
    }
    set {
      style = CaptionPresetStyle(
        wordStyle: newValue,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: style.backgroundStyle,
        backgroundColor: style.backgroundColor
      )
    }
  }

  @objc
  public var backgroundStyle: CaptionPresetBackgroundStyle {
    get {
      return style.backgroundStyle
    }
    set {
      style = CaptionPresetStyle(
        wordStyle: style.wordStyle,
        lineStyle: style.lineStyle,
        textAlignment: style.textAlignment,
        backgroundStyle: newValue,
        backgroundColor: style.backgroundColor
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
        backgroundColor: newValue
      )
    }
  }

  init() {
    super.init(frame: .zero)
    presetLayer = CaptionPresetStyleLayer(style: style)
    presetLayer!.frame = bounds
    layer.addSublayer(presetLayer!)
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func didMoveToSuperview() {
    super.didMoveToSuperview()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    presetLayer?.frame = bounds
  }
}
