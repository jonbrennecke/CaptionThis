import UIKit

@objc
class DeviceUtil: NSObject {
  @objc
  public static func isMemoryLimitedDevice() -> Bool {
    let device = UIDevice.current
    switch device.name {
    case "iPhone 6":
      fallthrough
    case "iPhone 6 Plus":
      return true
    default:
      return false
    }
  }
}
