import AVFoundation

class CaptionLayer: CALayer, PlaybackControlLayer {
  private let impl: CaptionStyleImpl
  internal var state: PlaybackControlLayerState = .paused

  init(impl: CaptionStyleImpl) {
    self.impl = impl
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = false
    resetAnimation()
  }

  override init(layer: Any) {
    let layer = layer as! CaptionLayer
    impl = layer.impl
    super.init(layer: layer)
    contentsScale = UIScreen.main.scale
    masksToBounds = false
    resetAnimation()
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func layoutSublayers() {
    super.layoutSublayers()
    resizeSublayers()
  }

  public func resizeSublayers() {
    impl.resize(inParentLayer: self)
  }

  internal func resetAnimation() {
    sublayers = nil
    pause()
    impl.layers.each { addSublayer($1) }
  }
}
