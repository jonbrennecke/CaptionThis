import UIKit

@objc
class TranscriptView : UIView {
  
  private var animationParams = VideoAnimationParams()
  private let animation = VideoAnimation()
  
  @objc
  public var textSegments: [TextSegmentParams]? {
    didSet {
      animationParams.textSegments = textSegments
      updateAnimation()
    }
  }

  @objc
  public var fontFamily: String? {
    didSet {
      animationParams.fontFamily = fontFamily
      updateAnimation()
    }
  }

  @objc
  public var textColor: UIColor? {
    didSet {
      animationParams.textColor = textColor
      updateAnimation()
    }
  }
  
  private func updateAnimation() {
    let animationLayer = animation.animate(withParams: animationParams)
    layer.addSublayer(animationLayer)
    animationLayer.frame = bounds
  }
  
}
