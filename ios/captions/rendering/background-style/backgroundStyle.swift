import Foundation

@objc
enum CaptionBackgroundStyle: Int {
  case solid
  case gradient
  case textBoundingBox
}

typealias BackgroundStyleRenderFunction = (
  _ layer: CALayer,
  _ captionStyle: CaptionStyle,
  _ backgroundHeight: Float,
  _ map: CaptionStringsMap,
  _ getSizeOfRow: @escaping (CaptionRowKey) -> CGSize
) -> Void

func render(backgroundStyle: CaptionBackgroundStyle) -> BackgroundStyleRenderFunction {
  switch backgroundStyle {
  case .gradient:
    return renderGradientBackgroundStyle
  case .solid:
    return renderSolidBackgroundStyle
  case .textBoundingBox:
    return textBoundingBoxBackgroundStyle
  }
}
