import AVFoundation
import UIKit

@objc
class OrientationUtil: NSObject {
  @objc
  public static func orientation(forAsset asset: AVAsset) -> UIImage.Orientation {
    let videoTracks = asset.tracks(withMediaType: .video)
    guard let videoTrack = videoTracks.first else {
      return .right
    }
    return orientation(forTransform: videoTrack.preferredTransform)
  }

  @objc
  public static func orientation(forTransform transform: CGAffineTransform) -> UIImage.Orientation {
    let angle = degrees(fromRadians: atan2(transform.b, transform.a))
    if compareFloats(angle, 0) {
      return .right
    } else if compareFloats(angle, 90) {
      return .up
    } else if compareFloats(angle, 180) {
      return .left
    } else if compareFloats(angle, -90) {
      return .down
    }
    return .right
  }

  @objc
  public static func orientation(forSize size: CGSize) -> UIImage.Orientation {
    if size.width > size.height {
      return .right
    } else {
      return .up
    }
  }

  private static func degrees(fromRadians radians: CGFloat) -> CGFloat {
    return radians * 180 / CGFloat.pi
  }

  private static func compareFloats(_ a: CGFloat, _ b: CGFloat) -> Bool {
    return abs(a - b) < CGFloat.ulpOfOne
  }

  @objc
  public static func imageOrientation(forInterfaceOrientation orientation: UIInterfaceOrientation) -> UIImage.Orientation {
    switch orientation {
    case .landscapeLeft:
      return UIImage.Orientation.left
    case .landscapeRight:
      return UIImage.Orientation.right
    case .portrait:
      return UIImage.Orientation.up
    case .portraitUpsideDown:
      return UIImage.Orientation.down
    case .unknown:
      return UIImage.Orientation.up
    }
  }
}
