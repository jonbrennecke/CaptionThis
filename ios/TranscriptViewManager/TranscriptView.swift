import UIKit

@objc
class TranscriptView : UIView {
  
  private var animationParams = VideoAnimationParams()
  
  // FIXME
  override var backgroundColor: UIColor? {
    set {
      animationParams.backgroundColor = newValue
      updateAnimation()
    }
    get {
      return animationParams.backgroundColor
    }
  }
  
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
    DispatchQueue.main.async {
      let animationLayer = VideoAnimationLayer(for: .view)
      animationLayer.frame = CGRect(origin: .zero, size: self.frame.size)
      animationLayer.animate(withParams: self.animationParams)
      animationLayer.beginTime = CACurrentMediaTime()
      self.layer.insertSublayer(animationLayer, at: 0)
    }
  }
  
}
