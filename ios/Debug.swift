import Foundation

@objc
class Debug: NSObject {
  @objc
  public static func log(message: String) {
    print(message)
  }

  public static func log(format: String, _ args: CVarArg...) {
    print(String(format: format, arguments: args))
  }

  @objc
  public static func log(format: String, arguments args: [Any]) {
    print(String(format: format, arguments: args as! [CVarArg]))
  }

  @objc
  static func log(error: Error) {
    print(error.localizedDescription)
  }
}
