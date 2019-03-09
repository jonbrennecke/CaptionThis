@objc
enum CaptionPresetWordStyle: Int {
  case animated
  case none
}

@objc
enum CaptionPresetBackgroundStyle: Int {
  case solid
  case gradient
}

struct CaptionPresetStyle {
  public let wordStyle: CaptionPresetWordStyle
  public let lineStyle: CaptionPresetLineStyle
  public let textAlignment: CaptionPresetTextAlignment
  public let backgroundStyle: CaptionPresetBackgroundStyle
  public let backgroundColor: UIColor
  public let font: UIFont
  public let textColor: UIColor
}
