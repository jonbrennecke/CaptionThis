import UIKit

protocol CaptionPresetBackgroundStyleImpl {
  var backgroundStyle: CaptionPresetBackgroundStyle { get }
  func applyBackgroundStyle(parentLayer: CALayer, backgroundColor: UIColor)
}

class CaptionPresetGradientBackgroundStyleImpl: CaptionPresetBackgroundStyleImpl {
  let backgroundStyle: CaptionPresetBackgroundStyle = .gradient

  func applyBackgroundStyle(parentLayer: CALayer, backgroundColor: UIColor) {
    let gradientLayer = CAGradientLayer()
    gradientLayer.frame = parentLayer.bounds
    gradientLayer.colors = [
      backgroundColor.withAlphaComponent(0.25).cgColor,
      backgroundColor.withAlphaComponent(0.15).cgColor,
      backgroundColor.withAlphaComponent(0).cgColor,
      backgroundColor.withAlphaComponent(0).cgColor
    ]
    gradientLayer.locations = [0, 0.15, 0.75, 1]
    gradientLayer.startPoint = CGPoint(x: 0.5, y: 1)
    gradientLayer.endPoint = CGPoint(x: 0.5, y: 0)
    parentLayer.insertSublayer(gradientLayer, at: 0)
  }
}

class CaptionPresetSolidBackgroundStyleImpl: CaptionPresetBackgroundStyleImpl {
  let backgroundStyle: CaptionPresetBackgroundStyle = .solid

  func applyBackgroundStyle(parentLayer: CALayer, backgroundColor: UIColor) {
    parentLayer.backgroundColor = backgroundColor.cgColor
  }
}
