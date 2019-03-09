import UIKit

struct VideoDimensions {
  public let size: CGSize
  public let orientation: UIImage.Orientation

  private var height: Float {
    return Float(size.height)
  }

  private var width: Float {
    return Float(size.width)
  }

  private static let defaults = VideoDimensions(
    size: CGSize(width: 1080, height: 1920),
    orientation: .up
  )

  init(size: CGSize, orientation: UIImage.Orientation) {
    self.size = size
    self.orientation = orientation
  }

  public var ratio: Float {
    let videoDimension = OrientationUtil.isPortrait(orientation: orientation) ?
      Float(height) : Float(width)
    let defaultVideoDimension = OrientationUtil.isPortrait(orientation: VideoDimensions.defaults.orientation) ?
      Float(VideoDimensions.defaults.height) : Float(VideoDimensions.defaults.width)
    return videoDimension / defaultVideoDimension
  }
}
