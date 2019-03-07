import Foundation

protocol CaptionPresetBackgroundStyleImpl {
  var backgroundStyle: CaptionPresetBackgroundStyle { get }
  func applyBackgroundStyle(layer: CALayer)
}

class CaptionPresetGradientBackgroundStyleImpl: CaptionPresetBackgroundStyleImpl {
  let backgroundStyle: CaptionPresetBackgroundStyle = .gradient

  func applyBackgroundStyle(layer _: CALayer) {
    // TODO:
  }
}

class CaptionPresetSolidBackgroundStyleImpl: CaptionPresetBackgroundStyleImpl {
  let backgroundStyle: CaptionPresetBackgroundStyle = .solid

  func applyBackgroundStyle(layer _: CALayer) {
    // TODO:
  }
}
