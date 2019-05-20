import AVFoundation

class CaptionPresetLayer: CALayer {
  public typealias Impl = CaptionStyleImpl

  private let impl: Impl

  init(impl: CaptionStyleImpl) {
    self.impl = impl
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = true
    initAnimation()
  }

  override init(layer: Any) {
    let layer = layer as! CaptionPresetLayer
    impl = layer.impl
    super.init(layer: layer)
    contentsScale = UIScreen.main.scale
    masksToBounds = true
    initAnimation()
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func layoutSublayers() {
    super.layoutSublayers()
    resizeSublayers()
  }

  private func initAnimation() {
    impl.layers.each { addSublayer($1) }
  }

  private func resizeSublayers() {
    impl.resize(inParentLayer: self)
  }
}
