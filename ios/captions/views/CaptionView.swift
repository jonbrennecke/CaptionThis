import Captions
import UIKit

@objc(HSCaptionView)
class CaptionView: UIView {
  internal var state: PlaybackControllerState = .paused

  @objc
  var captionStyle: CaptionStyleJSON? {
    didSet {
      render()
    }
  }

  @objc
  var textSegments = [CaptionTextSegmentJSON]() {
    didSet {
      render()
    }
  }

  @objc
  var duration: CFTimeInterval = 0 {
    didSet {
      render()
    }
  }

  private func render() {
    // sanity check to fix a bug in renderCaptions, but there's probably a better way of doing this
    if frame == .zero {
      return
    }
    layer.sublayers = nil
    guard let captionStyle = captionStyle?.captionStyle else {
      return
    }
    let segments = textSegments.map({ $0.textSegment })
    renderCaptions(
      layer: layer,
      style: captionStyle,
      textSegments: segments,
      duration: duration
    )
  }

  // MARK: UIView method implementations

  init() {
    super.init(frame: .zero)
    render()
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    render()
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func didMoveToSuperview() {
    super.didMoveToSuperview()
    render()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    layer.frame = bounds
    render()
  }
}

extension CaptionView: PlaybackController {
  func resetAnimation() {
    render()
    pause()
  }

  @objc
  func resume() {
    resume(layer: layer)
  }

  @objc
  func pause() {
    pause(layer: layer)
  }

  @objc
  func restart() {
    restart(layer: layer)
  }

  @objc
  func seekTo(time: CFTimeInterval) {
    seekTo(layer: layer, time: time)
  }
}
