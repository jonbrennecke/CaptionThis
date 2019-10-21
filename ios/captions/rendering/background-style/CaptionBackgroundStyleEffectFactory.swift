import Foundation

typealias BackgroundStyleEffectFunction = (
  _ layer: CALayer,
  _ captionStyle: CaptionStyle,
  _ backgroundHeight: Float,
  _ map: CaptionStringsMap,
  _ getSizeOfRow: @escaping (CaptionRowKey) -> CGSize
) -> Void

func apply(backgroundStyle: CaptionBackgroundStyle) -> BackgroundStyleEffectFunction {
  switch backgroundStyle {
  case .gradient:
    return applyGradientBackgroundStyle
  case .solid:
    return applySolidBackgroundStyle
  case .textBoundingBox:
    return applyTextBoundingBoxBackgroundStyle
  }
}
