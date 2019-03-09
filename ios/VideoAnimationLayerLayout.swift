import Foundation

fileprivate let MAXIMUM_FONT_SIZE = Float(24)

struct VideoAnimationLayerLayout {
  public let containerPaddingHorizontal: Float
  public let containerPaddingVertical: Float
  public let textPaddingVertical: Float
  public let fontSize: Float
  public let textLineHeight: Float
  public let textHeight: Float
  public let frameHeight: Float
  public let maxCharactersPerLine: Int
  public let shadowOffsetHeight: Float
  public let animationMultipler: Float
  public let animationOffsetMultiplier: Float

  public static func layoutForView(orientation: UIImage.Orientation, style: CaptionPresetStyle) -> VideoAnimationLayerLayout {
    let orientationMultiplier = OrientationUtil.isLandscape(orientation: orientation) ? Float(9.0 / 16.0) : 1
    let containerPaddingHorizontal = 10 * orientationMultiplier
    let containerPaddingVertical = 5 * orientationMultiplier
    let textPaddingVertical = 5 * orientationMultiplier
    let fontSize = orientationMultiplier * Float(style.font.pointSize)
    let textLineHeight = fontSize * 1.50
    let textHeight = textLineHeight + textPaddingVertical * 2
    let frameHeight = textHeight + containerPaddingVertical * 2
    let maxCharactersPerLine = Int((Float(UIScreen.main.bounds.width) / (fontSize * 0.65)).rounded())
    return VideoAnimationLayerLayout(
      containerPaddingHorizontal: containerPaddingHorizontal,
      containerPaddingVertical: containerPaddingVertical,
      textPaddingVertical: textPaddingVertical,
      fontSize: fontSize,
      textLineHeight: textLineHeight,
      textHeight: textHeight,
      frameHeight: frameHeight,
      maxCharactersPerLine: maxCharactersPerLine,
      shadowOffsetHeight: 1,
      animationMultipler: -1,
      animationOffsetMultiplier: 1
    )
  }

  @available(*, deprecated, message: "use CaptionLayout.layoutForView(orientation:style:)")
  public static func layoutForView(orientation: UIImage.Orientation, model: VideoAnimationLayerModel) -> VideoAnimationLayerLayout {
    let orientationMultiplier = OrientationUtil.isLandscape(orientation: orientation) ? Float(9.0 / 16.0) : 1
    let containerPaddingHorizontal = 10 * orientationMultiplier
    let containerPaddingVertical = 5 * orientationMultiplier
    let textPaddingVertical = 5 * orientationMultiplier
    let fontSize = orientationMultiplier * model.fontSize
    let textLineHeight = fontSize * 1.50
    let lineMultiplier = Float(model.lineStyle == .oneLine ? 1.0 : 2.0)
    let textHeight = textLineHeight * lineMultiplier + textPaddingVertical * 2
    let frameHeight = textHeight + containerPaddingVertical * 2
    let maxCharactersPerLine = Int((Float(UIScreen.main.bounds.width) / (fontSize * 0.65)).rounded())
    return VideoAnimationLayerLayout(
      containerPaddingHorizontal: containerPaddingHorizontal,
      containerPaddingVertical: containerPaddingVertical,
      textPaddingVertical: textPaddingVertical,
      fontSize: fontSize,
      textLineHeight: textLineHeight,
      textHeight: textHeight,
      frameHeight: frameHeight,
      maxCharactersPerLine: maxCharactersPerLine,
      shadowOffsetHeight: 1,
      animationMultipler: -1,
      animationOffsetMultiplier: 1
    )
  }

  @available(*, deprecated, message: "TODO")
  public static func layoutForExport(dimensions: VideoDimensions, model: VideoAnimationLayerModel) -> VideoAnimationLayerLayout {
    let videoSizeRatio = dimensions.ratio
    let containerPaddingHorizontal = 45 * videoSizeRatio
    let containerPaddingVertical = 15 * videoSizeRatio
    let textPaddingVertical = 5 * videoSizeRatio
    let fontSize = 3 * videoSizeRatio * model.fontSize
    let textLineHeight = fontSize * 1.50
    let lineMultiplier = Float(model.lineStyle == .oneLine ? 1.0 : 2.0)
    let textHeight = textLineHeight * lineMultiplier + textPaddingVertical * 2
    let frameHeight = textHeight + containerPaddingVertical * 2
    let maxCharactersPerLine = Int((Float(dimensions.size.width) / (fontSize * 0.65)).rounded())
    return VideoAnimationLayerLayout(
      containerPaddingHorizontal: containerPaddingHorizontal,
      containerPaddingVertical: containerPaddingVertical,
      textPaddingVertical: textPaddingVertical,
      fontSize: fontSize,
      textLineHeight: textLineHeight,
      textHeight: textHeight,
      frameHeight: frameHeight,
      maxCharactersPerLine: maxCharactersPerLine,
      shadowOffsetHeight: -1,
      animationMultipler: 1,
      animationOffsetMultiplier: 0
    )
  }
}
