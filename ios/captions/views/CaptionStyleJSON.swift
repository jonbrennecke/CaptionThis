import Captions
import Foundation

@objc(HSCaptionStyleJSON)
final class CaptionStyleJSON: NSObject, Codable {
  @objc(HSCaptionStyleColorJSON)
  final class Color: NSObject, Codable {
    let red: Float
    let green: Float
    let blue: Float
    let alpha: Float

    init(red: Float, green: Float, blue: Float, alpha: Float) {
      self.red = red
      self.green = green
      self.blue = blue
      self.alpha = alpha
    }

    var uiColor: UIColor {
      UIColor(
        red: CGFloat(red),
        green: CGFloat(green),
        blue: CGFloat(blue),
        alpha: CGFloat(alpha)
      )
    }
  }

  @objc(HSCaptionBackgroundStyleJSON)
  final class BackgroundStyle: NSObject, Codable {
    @objc(HSCaptionBackgroundStyleTypeJSON)
    enum StyleType: Int, CodingKey, Codable {
      case none
      case solid
      case gradient
      case textBoundingBox

      private struct Constants {
        static let types: [String: StyleType] = [
          "none": .none,
          "solid": .solid,
          "gradient": .gradient,
          "textBoundingBox": .textBoundingBox,
        ]
      }

      init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let string = try container.decode(String.self)
        guard let styleType = Constants.types[string] else {
          fatalError("missing constant definition")
        }
        self = styleType
      }
    }

    let styleType: StyleType
    let backgroundColor: Color
    let backgroundHeight: Float

    init(styleType: StyleType, backgroundColor: Color, backgroundHeight: Float) {
      self.styleType = styleType
      self.backgroundColor = backgroundColor
      self.backgroundHeight = backgroundHeight
    }

    var backgroundStyle: CaptionStyle.BackgroundStyle? {
      switch styleType {
      case .none:
        return CaptionStyle.BackgroundStyle.none
      case .gradient:
        return .gradient(backgroundColor: backgroundColor.uiColor, backgroundHeight: backgroundHeight)
      case .solid:
        return .solid(backgroundColor: backgroundColor.uiColor)
      case .textBoundingBox:
        return .textBoundingBox(backgroundColor: backgroundColor.uiColor)
      }
    }
  }

  @objc(HSCaptionLineStyleJSON)
  final class LineStyle: NSObject, Codable {
    
    @objc(HSCaptionLineStyleTypeJSON)
    enum StyleType: Int, Codable {
      case fadeInOut
      case translateUp
      
      private struct Constants {
        static let types: [String: StyleType] = [
          "fadeInOut": .fadeInOut,
          "translateUp": .translateUp
        ]
      }

      init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let string = try container.decode(String.self)
        guard let styleType = Constants.types[string] else {
          fatalError("missing constant definition")
        }
        self = styleType
      }
    }

    @objc(HSCaptionLineStyleFadeInOutPropertiesJSON)
    final class FadeInOutProperties: NSObject, Codable {
      @objc(HSCaptionLineStyleFadeInOutPropertiesPaddingJSON)
      final class Padding: NSObject, Codable {
        let vertical: Float

        init(vertical: Float) {
          self.vertical = vertical
        }

        var padding: CaptionStyle.LineStyle.Padding {
          CaptionStyle.LineStyle.Padding(vertical: vertical)
        }
      }

      let numberOfLines: Int
      let padding: Padding

      init(numberOfLines: Int, padding: Padding) {
        self.numberOfLines = numberOfLines
        self.padding = padding
      }
    }

    let styleType: StyleType
    let fadeInOutProperties: FadeInOutProperties?

    init(styleType: StyleType, fadeInOutProperties: FadeInOutProperties?) {
      self.styleType = styleType
      self.fadeInOutProperties = fadeInOutProperties
    }

    var lineStyle: CaptionStyle.LineStyle? {
      switch (styleType, fadeInOutProperties) {
      case let (.fadeInOut, .some(props)):
        return .fadeInOut(
          numberOfLines: props.numberOfLines,
          padding: props.padding.padding
        )
      case (.translateUp, _):
        return .translateUp
      default:
        return nil
      }
    }
  }

  @objc(HSCaptionWordStyleJSON)
  enum WordStyle: Int, Codable {
    case animated
    case none

    var wordStyle: CaptionStyle.WordStyle {
      switch self {
      case .animated:
        return .animated
      case .none:
        return .none
      }
    }

    private struct Constants {
      static let types: [String: WordStyle] = [
        "none": .none,
        "animated": .animated,
      ]
    }

    init(from decoder: Decoder) throws {
      let container = try decoder.singleValueContainer()
      let string = try container.decode(String.self)
      guard let styleType = Constants.types[string] else {
        fatalError("missing constant definition")
      }
      self = styleType
    }
  }

  @objc(HSCaptionTextStyleJSON)
  final class TextStyle: NSObject, Codable {
    let font: Font
    let color: Color
    let shadow: Shadow
    let alignment: Alignment

    @objc(HSFontJSON)
    final class Font: NSObject, Codable {
      let fontFamily: String
      let pointSize: Float

      init(fontFamily: String, pointSize: Float) {
        self.fontFamily = fontFamily
        self.pointSize = pointSize
      }

      var uiFont: UIFont? {
        UIFont(name: fontFamily, size: CGFloat(pointSize))
      }
    }

    @objc(HSCaptionTextStyleShadowJSON)
    final class Shadow: NSObject, Codable {
      let opacity: Float
      let color: Color

      init(opacity: Float, color: Color) {
        self.opacity = opacity
        self.color = color
      }

      var shadow: CaptionStyle.TextStyle.Shadow {
        CaptionStyle.TextStyle.Shadow(opacity: opacity, color: color.uiColor)
      }
    }

    @objc(HSCapionTextStyleAlignmentJSON)
    enum Alignment: Int, Codable {
      case left
      case right
      case center

      var alignment: CaptionStyle.TextStyle.Alignment {
        switch self {
        case .left:
          return .left
        case .right:
          return .right
        case .center:
          return .center
        }
      }

      private struct Constants {
        static let types: [String: Alignment] = [
          "left": .left,
          "right": .right,
          "center": .center,
        ]
      }

      init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let string = try container.decode(String.self)
        guard let styleType = Constants.types[string] else {
          fatalError("missing constant definition")
        }
        self = styleType
      }
    }

    init(font: Font, color: Color, shadow: Shadow, alignment: Alignment) {
      self.font = font
      self.color = color
      self.shadow = shadow
      self.alignment = alignment
    }

    var textStyle: CaptionStyle.TextStyle? {
      guard let font = font.uiFont else {
        return nil
      }
      return CaptionStyle.TextStyle(
        font: font,
        color: color.uiColor,
        shadow: shadow.shadow,
        alignment: alignment.alignment
      )
    }
  }

  let wordStyle: WordStyle
  let textStyle: TextStyle
  let backgroundStyle: BackgroundStyle
  let lineStyle: LineStyle

  init(wordStyle: WordStyle, textStyle: TextStyle, backgroundStyle: BackgroundStyle, lineStyle: LineStyle) {
    self.wordStyle = wordStyle
    self.textStyle = textStyle
    self.backgroundStyle = backgroundStyle
    self.lineStyle = lineStyle
  }

  var captionStyle: CaptionStyle? {
    guard
      let textStyle = textStyle.textStyle,
      let backgroundStyle = backgroundStyle.backgroundStyle,
      let lineStyle = lineStyle.lineStyle
    else {
      return nil
    }
    return CaptionStyle(
      wordStyle: wordStyle.wordStyle,
      lineStyle: lineStyle,
      backgroundStyle: backgroundStyle,
      textStyle: textStyle
    )
  }

  @objc(fromJSON:)
  static func from(json: Data) -> CaptionStyleJSON? {
    try? JSONDecoder().decode(CaptionStyleJSON.self, from: json)
  }
}
