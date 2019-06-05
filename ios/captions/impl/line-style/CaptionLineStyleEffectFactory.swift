import Foundation

protocol CaptionLineStyleEffectFactory {
  var lineStyle: CaptionLineStyle { get }
  var allEffectedKeys: [CaptionStyleImpl.LayerKey] { get }

  func createEffect(
    key: CaptionStyleImpl.LayerKey,
    map: CaptionStringsMap,
    duration: CFTimeInterval
  ) -> PresentationEffect
}

func getLineStyleEffectFactory(style: CaptionLineStyle) -> CaptionLineStyleEffectFactory {
  switch style {
  case .fadeInOut:
    return CaptionLineStyleFadeInOutEffectFactory()
  case .translateY:
    return CaptionLineStyleTranslateYEffectFactory()
  }
}
