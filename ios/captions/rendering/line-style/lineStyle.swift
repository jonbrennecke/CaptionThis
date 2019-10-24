import Foundation

@objc
enum CaptionLineStyle: Int {
  case fadeInOut
  case translateY
}

typealias LineStyleRenderFunction = (
  _ layer: CALayer,
  _ key: CaptionRowKey,
  _ map: CaptionStringsMap,
  _ duration: CFTimeInterval
) -> Void

func render(lineStyle: CaptionLineStyle) -> LineStyleRenderFunction {
  switch lineStyle {
  case .fadeInOut:
    return renderFadeInOutLineStyle
  case .translateY:
    return renderTranslateYLineStyle
  }
}
