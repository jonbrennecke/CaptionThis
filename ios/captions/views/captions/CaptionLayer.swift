import AVFoundation

class CaptionLayer: CALayer, PlaybackControlLayer {
  private let impl: CaptionStyleImpl
  private let layout: CaptionLayerLayout
  private let viewSize: CGSize
  internal var state: PlaybackControlLayerState = .paused

  init(style: CaptionStyle, layout: CaptionLayerLayout, textSegments: [CaptionTextSegment], duration: CFTimeInterval, viewSize: CGSize) {
    impl = CaptionPresetStyleImplFactory.impl(forStyle: style, textSegments: textSegments, duration: duration)
    self.layout = layout
    self.viewSize = viewSize
    super.init()
    contentsScale = UIScreen.main.scale
    masksToBounds = false
    resetAnimation()
  }

  override init(layer: Any) {
    let layer = layer as! CaptionLayer
    impl = layer.impl
    layout = layer.layout
    viewSize = layer.viewSize
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
    impl.resize(inParentLayer: self, layout: layout, viewSize: viewSize)
  }

  internal func resetAnimation() {
    sublayers = nil
    pause()
    impl.layers.each { addSublayer($1) }
  }
}
