import UIKit

fileprivate let ELEMENT_SIZE: CGFloat = 3

@objc
class HueGradientView: UIView {
  private var _color: UIColor = .blue

  @objc
  public var color: UIColor {
    get {
      return _color
    }
    set {
      _color = newValue
      setNeedsDisplay()
    }
  }

  private var saturationAndBrightness: (CGFloat, CGFloat) {
    var hue: CGFloat = 0
    var saturation: CGFloat = 0
    var brightness: CGFloat = 0
    var alpha: CGFloat = 0
    _color.getHue(&hue, saturation: &saturation, brightness: &brightness, alpha: &alpha)
    return (saturation, brightness)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    setNeedsDisplay()
    backgroundColor = .white
  }

  override func draw(_ rect: CGRect) {
    guard let context = UIGraphicsGetCurrentContext() else {
      return
    }
    let saturation: CGFloat = 1.0
    let brightness: CGFloat = 1.0
    let elementSize = CGSize(width: ELEMENT_SIZE, height: ELEMENT_SIZE)
    for y in stride(from: CGFloat(0.0), to: rect.height, by: ELEMENT_SIZE) {
      let hue = y / rect.height
      for x in stride(from: CGFloat(0.0), to: rect.width, by: ELEMENT_SIZE) {
        let color = UIColor(hue: hue, saturation: saturation, brightness: brightness, alpha: 1.0)
        context.setFillColor(color.cgColor)
        let point = CGPoint(x: x, y: y)
        let rect = CGRect(origin: point, size: elementSize)
        context.fill(rect)
      }
    }
  }

  @objc
  public func color(atHorizontalOffset offset: CGFloat) -> UIColor {
    let hue = offset / frame.width
    let (saturation, brightness) = saturationAndBrightness
    return UIColor(hue: hue, saturation: saturation, brightness: brightness, alpha: alpha)
  }
}
