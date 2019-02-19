import UIKit

@objc
class DeviceUtil: NSObject {
  @objc
  public static func isMemoryLimitedDevice() -> Bool {
    let device = UIDevice.current
    switch device.name {
    case "iPhone 5s":
      fallthrough
    case "iPhone SE":
      fallthrough
    case "iPhone 6":
      fallthrough
    case "iPhone 6 Plus":
      fallthrough
    case "iPhone 6s":
      fallthrough
    case "iPhone 6s Plus":
      return true
    default:
      return false
    }
  }
}
