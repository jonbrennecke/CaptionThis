import Foundation

@objc
enum CaptionWordStyle: Int {
  case animated
  case none
}

typealias WordStyleRenderFunction = (
  _ layer: CALayer,
  _ key: CaptionRowKey,
  _ map: CaptionStringsMap,
  _ duration: CFTimeInterval,
  _ style: CaptionStyle
) -> Void

func render(wordStyle: CaptionWordStyle) -> WordStyleRenderFunction {
  switch wordStyle {
  case .animated:
    return renderAnimatedWordStyle
  case .none:
    return renderNoWordStyle
  }
}
