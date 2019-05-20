import Foundation

@objc
class CaptionViewLayout: NSObject {
  public let size: CGSize
  public let origin: CGPoint

  public init(size: CGSize, origin: CGPoint) {
    self.size = size
    self.origin = origin
    super.init()
  }

  public convenience init?(dict: Dictionary<String, Any>) {
    guard let size = dict["size"] as? Dictionary<String, Any>, let origin = dict["origin"] as? Dictionary<String, Any> else {
      return nil
    }
    guard
      let x = origin["x"] as? CGFloat,
      let y = origin["y"] as? CGFloat,
      let width = size["width"] as? CGFloat,
      let height = size["height"] as? CGFloat
    else {
      return nil
    }
    self.init(size: CGSize(width: width, height: height), origin: CGPoint(x: x, y: y))
  }

  @objc
  public convenience init?(nsDict: NSDictionary) {
    guard let swiftDict = nsDict as? Dictionary<String, Any> else {
      return nil
    }
    self.init(dict: swiftDict)
  }

  public static let defaultLayout: CaptionViewLayout = CaptionViewLayout(size: .zero, origin: .zero)
}
