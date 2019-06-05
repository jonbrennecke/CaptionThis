@objc
class CaptionStyle: NSObject {
  public let wordStyle: CaptionWordStyle
  public let lineStyle: CaptionLineStyle
  public let textAlignment: CaptionTextAlignment
  public let backgroundStyle: CaptionBackgroundStyle
  public let backgroundColor: UIColor
  public let font: UIFont
  public let textColor: UIColor

  @objc
  init(wordStyle: CaptionWordStyle,
       lineStyle: CaptionLineStyle,
       textAlignment: CaptionTextAlignment,
       backgroundStyle: CaptionBackgroundStyle,
       backgroundColor: UIColor,
       font: UIFont,
       textColor: UIColor) {
    self.wordStyle = wordStyle
    self.lineStyle = lineStyle
    self.textAlignment = textAlignment
    self.backgroundStyle = backgroundStyle
    self.backgroundColor = backgroundColor
    self.font = font
    self.textColor = textColor
  }
}

typealias CaptionPresetStyle = CaptionStyle

@objc
class CaptionExportStyle: CaptionStyle {
  public let viewSize: CGSize

  @objc
  init(wordStyle: CaptionWordStyle,
       lineStyle: CaptionLineStyle,
       textAlignment: CaptionTextAlignment,
       backgroundStyle: CaptionBackgroundStyle,
       backgroundColor: UIColor,
       font: UIFont,
       textColor: UIColor,
       viewSize: CGSize) {
    self.viewSize = viewSize
    super.init(
      wordStyle: wordStyle,
      lineStyle: lineStyle,
      textAlignment: textAlignment,
      backgroundStyle: backgroundStyle,
      backgroundColor: backgroundColor,
      font: font,
      textColor: textColor
    )
  }
}
