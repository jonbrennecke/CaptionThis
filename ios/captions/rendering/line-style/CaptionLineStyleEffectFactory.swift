import Foundation

protocol CaptionLineStyleEffectFactory {
  var lineStyle: CaptionLineStyle { get }
  var allEffectedRows: [CaptionRowKey] { get }

  func createEffect(
    key: CaptionRowKey,
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
