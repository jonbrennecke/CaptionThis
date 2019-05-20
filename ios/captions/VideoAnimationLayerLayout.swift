import Foundation

fileprivate let MAXIMUM_FONT_SIZE = Float(24)
fileprivate let CAPTION_VIEW_HEIGHT = Float(85)

// TODO: rename to CaptionLayerLayout
struct VideoAnimationLayerLayout {
  public let containerPaddingHorizontal: Float
  public let containerPaddingVertical: Float
  public let textPaddingVertical: Float
  public let fontSize: Float
  public let textLineHeight: Float
  public let textHeight: Float
  public let frameHeight: Float
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
    return VideoAnimationLayerLayout(
      containerPaddingHorizontal: containerPaddingHorizontal,
      containerPaddingVertical: containerPaddingVertical,
      textPaddingVertical: textPaddingVertical,
      fontSize: fontSize,
      textLineHeight: textLineHeight,
      textHeight: textHeight,
      frameHeight: frameHeight,
      shadowOffsetHeight: 1,
      animationMultipler: -1,
      animationOffsetMultiplier: 1
    )
  }

  public static func layoutForExport(dimensions: VideoDimensions, style: CaptionExportStyle) -> VideoAnimationLayerLayout {
    let heightRatio = Float(dimensions.size.height) / Float(style.viewSize.height)
    let frameHeight = CAPTION_VIEW_HEIGHT * heightRatio
    let fontSize = heightRatio * Float(style.font.pointSize)

    // TODO:
    let videoSizeRatio = dimensions.ratio
    let containerPaddingHorizontal = 45 * videoSizeRatio
    let containerPaddingVertical = 15 * videoSizeRatio
    let textPaddingVertical = 5 * videoSizeRatio
    let textLineHeight = fontSize * 1.50
    let textHeight = textLineHeight + textPaddingVertical * 2

    return VideoAnimationLayerLayout(
      containerPaddingHorizontal: containerPaddingHorizontal,
      containerPaddingVertical: containerPaddingVertical,
      textPaddingVertical: textPaddingVertical,
      fontSize: fontSize,
      textLineHeight: textLineHeight,
      textHeight: textHeight,
      frameHeight: frameHeight,
      shadowOffsetHeight: -1,
      animationMultipler: 1,
      animationOffsetMultiplier: 0
    )
  }
}

typealias CaptionLayerLayout = VideoAnimationLayerLayout
