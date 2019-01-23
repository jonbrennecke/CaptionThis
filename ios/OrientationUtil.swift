import UIKit

@objc
class OrientationUtil: NSObject {
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
}
