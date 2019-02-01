import UIKit

@objc
class CaptionsView: UIView {
  private var animationLayer: VideoAnimationLayer? {
    return layer.sublayers?.first as? VideoAnimationLayer
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    animationLayer?.frame = layer.frame
  }

  @objc
  public func animate(params: VideoAnimationBridgeParams) {
    let model = params.model()
    let orientation = params.orientation
    let layout = VideoAnimationLayerLayout.layoutForView(orientation: orientation, model: model)
    guard let animationLayer = animationLayer else {
      let animationLayer = VideoAnimationLayer(layout: layout, model: model)
      animationLayer.frame = layer.frame
      layer.addSublayer(animationLayer)
      return
    }
    animationLayer.update(model: model, layout: layout)
  }

  @objc
  public func restart() {
    animationLayer?.restart()
  }

  @objc
  public func pause() {
    animationLayer?.pause()
  }

  @objc
  public func resume() {
    animationLayer?.resume()
  }

  @objc
  public func seek(toTime time: Double) {
    animationLayer?.seekTo(time: time)
  }
}
