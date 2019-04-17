import AVFoundation

class CaptionLayer: CALayer {
  private let impl: CaptionStyleImpl
  private let layout: CaptionLayerLayout

  init(style: CaptionStyle, layout: CaptionLayerLayout, textSegments: [CaptionTextSegment], duration: CFTimeInterval) {
    self.impl = CaptionPresetStyleImplFactory.impl(forStyle: style, textSegments: textSegments, duration: duration)
    self.layout = layout
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = false
    initAnimation()
  }

  override init(layer: Any) {
    let layer = layer as! CaptionLayer
    impl = layer.impl
    layout = layer.layout
    super.init(layer: layer)
    contentsScale = UIScreen.main.scale
    masksToBounds = false
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
    impl.setup(inParentLayer: self)
  }

  public func resizeSublayers() {
    impl.resize(inParentLayer: self, layout: layout)
  }
}
