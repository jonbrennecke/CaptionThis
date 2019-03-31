import UIKit

@objc(CaptionView)
class CaptionView : UIView {
  private var captionLayer: CaptionLayer?
  
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
  public var lineStyle: CaptionPresetLineStyle {
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
  public var wordStyle: CaptionPresetWordStyle {
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
  public var duration = CFTimeInterval(0) {
    didSet {
      updateCaptionLayer()
    }
  }
  
  @objc
  public var textSegments = [TextSegment]() {
    didSet {
      updateCaptionLayer()
    }
  }
  
  private func updateCaptionLayer() {
    captionLayer = CaptionLayer(style: style, textSegments: textSegments, duration: duration)
    guard let captionLayer = captionLayer else {
      return
    }
    captionLayer.frame = bounds
    layer.sublayers = nil
    layer.addSublayer(captionLayer)
  }
  
  // MARK: UIView method implementations
  
  init() {
    super.init(frame: .zero)
    captionLayer = CaptionLayer(style: style, textSegments: textSegments, duration: duration)
    captionLayer!.frame = bounds
    layer.addSublayer(captionLayer!)
  }
  
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func didMoveToSuperview() {
    super.didMoveToSuperview()
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
//    presetLayer?.frame = bounds
  }
}
