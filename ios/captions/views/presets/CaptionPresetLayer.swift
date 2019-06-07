import AVFoundation

class CaptionPresetLayer: CALayer {
  override init() {
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = true
  }

  override init(layer: Any) {
    let layer = layer as! CaptionPresetLayer
    super.init(layer: layer)
    contentsScale = UIScreen.main.scale
    masksToBounds = true
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
