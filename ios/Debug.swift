import Foundation

class Debug {
  static func log(message: String) {
    print(message)
  }
  
  static func log(format: String, _ arguments: CVarArg...) {
    print(String(format: format, arguments: arguments))
  }
  
  
  static func log(error: Error) {
    print(error)
  }
}
