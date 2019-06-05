import UIKit

class CaptionGradientBackgroundStyleEffectFactory: CaptionBackgroundStyleEffectFactory {
  let backgroundStyle: CaptionBackgroundStyle = .gradient

  func createEffect(backgroundColor: UIColor, layout: CaptionViewLayout, map _: CaptionStringsMap) -> PresentationEffect {
    let gradientLayerName = "gradientLayerName"
    return PresentationEffect(doEffect: { layer in
      let size = CGSize(width: layout.size.width, height: layout.size.height)
      let gradientLayer = CAGradientLayer()
      gradientLayer.name = gradientLayerName
      gradientLayer.frame = CGRect(origin: layout.origin, size: size)
      gradientLayer.colors = [
        backgroundColor.withAlphaComponent(0.8).cgColor,
        backgroundColor.withAlphaComponent(0).cgColor,
      ]
      gradientLayer.locations = [0, 1]
      gradientLayer.startPoint = CGPoint(x: 0.5, y: 1)
      gradientLayer.endPoint = CGPoint(x: 0.5, y: 0)
      layer.insertSublayer(gradientLayer, at: 0)
    }, undoEffect: createSublayerRemover(byName: gradientLayerName))
  }
}
