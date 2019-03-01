@objc
enum CaptionPresetWordStyle: Int {
  case animated
  case none
}

enum CaptionPresetBackgroundStyle {
  case solid
  case gradient
}

struct CaptionPreset {
  public let wordStyle: CaptionPresetWordStyle
  public let lineStyle: CaptionPresetLineStyle
  public let textAlignment: CaptionPresetTextAlignment
  public let backgroundStyle: CaptionPresetBackgroundStyle
}
