import UIKit

@objc
class CaptionPresetStyleView: UIView {
  private var presetLayer: CaptionPresetStyleLayer?

  private var preset = CaptionPreset(
    wordStyle: .none,
    lineStyle: .fadeInOut,
    textAlignment: .left,
    backgroundStyle: .solid
  ) {
    didSet {
      presetLayer = CaptionPresetStyleLayer(preset: preset)
      presetLayer!.frame = bounds
      layer.sublayers = nil
      layer.addSublayer(presetLayer!)
    }
  }

  @objc
  public var textAlignment: CaptionPresetTextAlignment {
    get {
      return preset.textAlignment
    }
    set {
      preset = CaptionPreset(
        wordStyle: preset.wordStyle,
        lineStyle: preset.lineStyle,
        textAlignment: newValue,
        backgroundStyle: preset.backgroundStyle
      )
    }
  }

  @objc
  public var lineStyle: CaptionPresetLineStyle {
    get {
      return preset.lineStyle
    }
    set {
      preset = CaptionPreset(
        wordStyle: preset.wordStyle,
        lineStyle: newValue,
        textAlignment: preset.textAlignment,
        backgroundStyle: preset.backgroundStyle
      )
    }
  }

  @objc
  public var wordStyle: CaptionPresetWordStyle {
    get {
      return preset.wordStyle
    }
    set {
      preset = CaptionPreset(
        wordStyle: newValue,
        lineStyle: preset.lineStyle,
        textAlignment: preset.textAlignment,
        backgroundStyle: preset.backgroundStyle
      )
    }
  }

  init() {
    super.init(frame: .zero)
    presetLayer = CaptionPresetStyleLayer(preset: preset)
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
