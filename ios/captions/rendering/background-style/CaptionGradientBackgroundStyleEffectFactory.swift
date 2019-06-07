import UIKit

class CaptionGradientBackgroundStyleEffectFactory: CaptionBackgroundStyleEffectFactory {
  let backgroundStyle: CaptionBackgroundStyle = .gradient

  func createEffect(backgroundColor: UIColor, layout: CaptionViewLayout, map _: CaptionStringsMap) -> PresentationEffect {
    let gradientLayerName = "gradientLayerName"
    return PresentationEffect(doEffect: { layer in
      let gradientLayer = createGradientLayer(color: backgroundColor)
      gradientLayer.name = gradientLayerName
      gradientLayer.frame = CGRect(origin: layout.origin, size: layout.size)
      layer.insertSublayer(gradientLayer, at: 0)
    }, undoEffect: createSublayerRemover(byName: gradientLayerName))
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
