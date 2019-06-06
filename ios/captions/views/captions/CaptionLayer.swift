import AVFoundation

class CaptionLayer: CALayer {
  override init() {
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = false
  }

  override init(layer: Any) {
    let layer = layer as! CaptionLayer
    super.init(layer: layer)
    contentsScale = UIScreen.main.scale
    masksToBounds = false
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
