import UIKit

class CaptionGradientBackgroundStyleEffectFactory: CaptionBackgroundStyleEffectFactory {
  let backgroundStyle: CaptionBackgroundStyle = .gradient

  func createEffect(backgroundColor: UIColor, map: CaptionStringsMap) -> PresentationEffect {
    let layerName = "layerName"
    return PresentationEffect(doEffect: { layer in
      let beginTime = CFTimeInterval(0)
      let backgroundLayer = CALayer()
      backgroundLayer.name = layerName
      backgroundLayer.frame = layer.bounds
      backgroundLayer.masksToBounds = false
      let gradientLayer = createGradientLayer(color: backgroundColor)
      gradientLayer.frame = layer.bounds
      backgroundLayer.insertSublayer(gradientLayer, at: 0)
      layer.insertSublayer(backgroundLayer, at: 0)
      let animation = AnimationUtil.fadeIn(at: beginTime)
      backgroundLayer.add(animation, forKey: layerName)
    }, undoEffect: createSublayerRemover(byName: layerName))
  }
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
