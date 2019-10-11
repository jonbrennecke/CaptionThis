import Foundation

protocol CaptionBackgroundStyleEffectFactory {
  var backgroundStyle: CaptionBackgroundStyle { get }

  func createEffect(
    backgroundColor: UIColor,
    backgroundHeight: Float,
    map: CaptionStringsMap
  ) -> PresentationEffect
}

func getBackgroundStyleEffectFactory(style: CaptionBackgroundStyle) -> CaptionBackgroundStyleEffectFactory {
  switch style {
  case .gradient:
    return CaptionGradientBackgroundStyleEffectFactory()
  case .solid:
    return CaptionSolidBackgroundStyleEffectFactory()
  }
}
