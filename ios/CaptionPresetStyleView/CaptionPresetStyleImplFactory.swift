import Foundation

class CaptionPresetStyleImplFactory {
  private init() { /* unimplemented */ }

  public static func impl(forPreset preset: CaptionPreset) -> CaptionPresetStyleImpl {
    let lineStyleImpl = impl(forLineStyle: preset.lineStyle)
    let textAlignmentImpl = impl(forTextAlignment: preset.textAlignment)
    let wordStyleImpl = impl(forWordStyle: preset.wordStyle)
    return CaptionPresetStyleImpl(lineStyleImpl: lineStyleImpl, textAlignmentImpl: textAlignmentImpl, wordStyleImpl: wordStyleImpl)
  }

  private static func impl(forLineStyle style: CaptionPresetLineStyle) -> CaptionPresetLineStyleImpl {
    switch style {
    case .fadeInOut:
      return CaptionPresetLineStyleFadeInOutImpl()
    case .translateY:
      return CaptionPresetLineStyleTranslateYImpl()
    }
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

  private static func impl(forWordStyle style: CaptionPresetWordStyle) -> CaptionPresetWordStyleImpl {
    switch style {
    case .animated:
      return CaptionPresetAnimatedWordStyleImpl()
    case .none:
      return CaptionPresetNoWordStyleImpl()
    }
  }
}
