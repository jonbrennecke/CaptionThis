import UIKit

protocol CaptionPresetBackgroundStyleImpl {
  var backgroundStyle: CaptionPresetBackgroundStyle { get }
  func applyBackgroundStyle(parentLayer: CALayer, backgroundColor: UIColor, layout: CaptionViewLayout)
}

class CaptionPresetGradientBackgroundStyleImpl: CaptionPresetBackgroundStyleImpl {
  let backgroundStyle: CaptionPresetBackgroundStyle = .gradient

  func applyBackgroundStyle(parentLayer: CALayer, backgroundColor: UIColor, layout: CaptionViewLayout) {
    let size = CGSize(width: layout.size.width, height: layout.size.height)
    let gradientLayer = CAGradientLayer()
    gradientLayer.frame = CGRect(origin: layout.origin, size: size)
    gradientLayer.colors = [
      backgroundColor.withAlphaComponent(0.20).cgColor,
      backgroundColor.withAlphaComponent(0.20).cgColor,
      backgroundColor.withAlphaComponent(0).cgColor,
    ]
    gradientLayer.locations = [0, 0.5, 1]
    gradientLayer.startPoint = CGPoint(x: 0.5, y: 1)
    gradientLayer.endPoint = CGPoint(x: 0.5, y: 0)
    parentLayer.insertSublayer(gradientLayer, at: 0)
  }
}

class CaptionPresetSolidBackgroundStyleImpl: CaptionPresetBackgroundStyleImpl {
  let backgroundStyle: CaptionPresetBackgroundStyle = .solid

  func applyBackgroundStyle(parentLayer: CALayer, backgroundColor: UIColor, layout _: CaptionViewLayout) {
    parentLayer.backgroundColor = backgroundColor.withAlphaComponent(0.9).cgColor
    parentLayer.masksToBounds = true
  }
}
