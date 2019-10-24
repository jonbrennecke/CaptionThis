import UIKit

func renderGradientBackgroundStyle(
  layer: CALayer,
  captionStyle: CaptionStyle,
  backgroundHeight: Float,
  map _: CaptionStringsMap,
  getSizeOfRow _: @escaping (CaptionRowKey) -> CGSize
) {
  let beginTime = CFTimeInterval(0)
  let backgroundLayer = CALayer()
  backgroundLayer.frame = layer.bounds
  backgroundLayer.masksToBounds = false
  let gradientLayer = createGradientLayer(color: captionStyle.backgroundColor)
  gradientLayer.frame = CGRect(
    origin: .zero,
    size: CGSize(width: layer.bounds.width, height: CGFloat(backgroundHeight))
  )
  backgroundLayer.insertSublayer(gradientLayer, at: 0)
  layer.insertSublayer(backgroundLayer, at: 0)
  let animation = AnimationUtil.fadeIn(at: beginTime)
  backgroundLayer.add(animation, forKey: nil)
}

fileprivate func createGradientLayer(color: UIColor) -> CAGradientLayer {
  let gradientLayer = CAGradientLayer()
  gradientLayer.colors = [
    color.withAlphaComponent(0.8).cgColor,
    color.withAlphaComponent(0).cgColor,
  ]
  gradientLayer.locations = [0, 1]
  gradientLayer.startPoint = CGPoint(x: 0.5, y: 1)
  gradientLayer.endPoint = CGPoint(x: 0.5, y: 0)
  return gradientLayer
}
