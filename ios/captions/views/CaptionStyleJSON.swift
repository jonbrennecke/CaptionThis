import Captions

@objc(HSCaptionStyleJSON)
class CaptionStyleJSON : NSObject {
  
  @objc(HSCaptionStyleColorJSON)
  class Color : NSObject {
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
      UIColor.init(
        red: CGFloat(red),
        green: CGFloat(green),
        blue: CGFloat(blue),
        alpha: CGFloat(alpha)
      )
    }
  }
  
  @objc(HSCaptionBackgroundStyleJSON)
  class BackgroundStyle : NSObject {

    @objc(HSCaptionBackgroundStyleTypeJSON)
    enum StyleType : Int {
      case none
      case solid
      case gradient
      case textBoundingBox
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
  class LineStyle : NSObject {

    @objc(HSCaptionLineStyleTypeJSON)
    enum LineStyleType : Int {
      case fadeInOut
      case translateUp
    }

    @objc(HSCaptionLineStyleFadeInOutPropertiesJSON)
    class FadeInOutProperties : NSObject {
      
      @objc(HSCaptionLineStyleFadeInOutPropertiesPaddingJSON)
      class Padding : NSObject {
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
    
    let styleType: LineStyleType
    let fadeInOutProperties: FadeInOutProperties?
    
    init(styleType: LineStyleType, fadeInOutProperties: FadeInOutProperties?) {
      self.styleType = styleType
      self.fadeInOutProperties = fadeInOutProperties
    }
    
    var lineStyle: CaptionStyle.LineStyle? {
      switch (styleType, fadeInOutProperties) {
      case (.fadeInOut, .some(let props)):
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
  enum WordStyle : Int {
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
  }
  
  @objc(HSCaptionTextStyleJSON)
  class TextStyle : NSObject {
    let font: Font
    let color: Color
    let shadow: Shadow
    let alignment: Alignment

    @objc(HSFontJSON)
    class Font : NSObject {
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
    class Shadow : NSObject {
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
    enum Alignment : Int {
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
}
