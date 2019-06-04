import Foundation

// TODO: replace this with a single function (or remove entirely)
class CaptionPresetStyleImplFactory {
  private init() { /* unimplemented */ }

  public static func impl(forStyle style: CaptionPresetStyle, textSegments: [CaptionTextSegment], layout: CaptionViewLayout, duration: CFTimeInterval) -> CaptionStyleImpl {
    let textAlignmentImpl = impl(forTextAlignment: style.textAlignment)
    let backgroundStyleImpl = impl(forBackgroundStyle: style.backgroundStyle)
    return CaptionStyleImpl(
      textAlignmentImpl: textAlignmentImpl,
      backgroundStyleImpl: backgroundStyleImpl,
      textSegments: textSegments,
      style: style,
      layout: layout,
      duration: duration
    )
  }

  private static func impl(forTextAlignment alignment: CaptionPresetTextAlignment) -> CaptionPresetTextAlignmentImpl {
    switch alignment {
    case .center:
      return CaptionPresetTextAlignmentCenterImpl()
    case .left:
      return CaptionPresetTextAlignmentLeftImpl()
    case .right:
      return CaptionPresetTextAlignmentRightImpl()
    }
  }

  private static func impl(forBackgroundStyle style: CaptionPresetBackgroundStyle) -> CaptionPresetBackgroundStyleImpl {
    switch style {
    case .gradient:
      return CaptionPresetGradientBackgroundStyleImpl()
    case .solid:
      return CaptionPresetSolidBackgroundStyleImpl()
    }
  }
}
