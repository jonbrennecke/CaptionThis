import UIKit

public struct CaptionStyle {
  let wordStyle: WordStyle
  let lineStyle: LineStyle
  let backgroundStyle: BackgroundStyle
  let textStyle: TextStyle

  public enum WordStyle {
    case animated
    case none
  }

  public enum LineStyle {
    case fadeInOut(numberOfLines: Int, padding: Padding)
    case translateUp

    public struct Padding {
      let vertical: Float

      public init(vertical: Float) {
        self.vertical = vertical
      }
    }
  }

  public enum BackgroundStyle {
    case none
    case solid(backgroundColor: UIColor)
    case gradient(backgroundColor: UIColor, backgroundHeight: Float)
    case textBoundingBox(backgroundColor: UIColor)
  }

  public struct TextStyle {
    let font: UIFont
    let color: UIColor
    let shadow: Shadow
    let alignment: Alignment

    public init(font: UIFont, color: UIColor, shadow: Shadow, alignment: Alignment) {
      self.font = font
      self.color = color
      self.shadow = shadow
      self.alignment = alignment
    }

    public struct Shadow {
      let opacity: Float
      let color: UIColor

      public init(opacity: Float, color: UIColor) {
        self.opacity = opacity
        self.color = color
      }
    }

    public enum Alignment {
      case center
      case left
      case right

      public func textLayerAlignmentMode() -> CATextLayerAlignmentMode {
        switch self {
        case .center:
          return .center
        case .left:
          return .left
        case .right:
          return .right
        }
      }
    }
  }

  public init(
    wordStyle: CaptionStyle.WordStyle,
    lineStyle: CaptionStyle.LineStyle,
    backgroundStyle: CaptionStyle.BackgroundStyle,
    textStyle: TextStyle
  ) {
    self.wordStyle = wordStyle
    self.lineStyle = lineStyle
    self.backgroundStyle = backgroundStyle
    self.textStyle = textStyle
  }
}
