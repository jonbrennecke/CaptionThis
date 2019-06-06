import Foundation

protocol CaptionWordStyleEffectFactory {
  var wordStyle: CaptionWordStyle { get }

  func createEffect(
    key: CaptionRowKey,
    map: CaptionStringsMap,
    duration: CFTimeInterval,
    textAlignment: CaptionTextAlignment
  ) -> PresentationEffect
}

func getWordStyleEffectFactory(style: CaptionWordStyle) -> CaptionWordStyleEffectFactory {
  switch style {
  case .animated:
    return CaptionAnimatedWordStyleEffectFactory()
  case .none:
    return CaptionNoWordStyleEffectFactory()
  }
}