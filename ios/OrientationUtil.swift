import UIKit

@objc
class OrientationUtil: NSObject {
  // FIXME: should return UIImage.Orientation
  @objc
  public static func orientation(forTransform transform: CGAffineTransform) -> UIInterfaceOrientation {
    let angle = degrees(fromRadians: atan2(transform.b, transform.a))
    if compareFloats(angle, 0) {
      return .landscapeRight
    } else if compareFloats(angle, 90) {
      return .portrait
    } else if compareFloats(angle, 180) {
      return .landscapeLeft
    } else if compareFloats(angle, -90) {
      return .portraitUpsideDown
    }
    return .landscapeRight
  }

  // FIXME: should return UIImage.Orientation
  @objc
  public static func orientation(forSize size: CGSize) -> UIInterfaceOrientation {
    if size.width > size.height {
      return .landscapeRight
    } else {
      return .portrait
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
