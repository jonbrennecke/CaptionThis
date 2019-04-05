import AVFoundation

class CaptionLayer: CALayer {
  private let impl: CaptionStyleImpl

  init(style: CaptionStyle, textSegments: [TextSegment], duration: CFTimeInterval) {
    impl = CaptionPresetStyleImplFactory.impl(forStyle: style, textSegments: textSegments, duration: duration)
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = false
    initAnimation()
  }

  override init(layer: Any) {
    let layer = layer as! CaptionLayer
    impl = layer.impl
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

  private func resizeSublayers() {
    impl.resize(inParentLayer: self)
  }
}
