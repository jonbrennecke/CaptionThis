import UIKit

fileprivate let ELEMENT_SIZE: CGFloat = 1

@objc
class SaturationAndBrightnessGradientView : UIView {
  
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
  
  private var hue: CGFloat {
    var hue: CGFloat = 0
    var saturation: CGFloat = 0
    var brightness: CGFloat = 0
    var alpha: CGFloat = 0
    _color.getHue(&hue, saturation: &saturation, brightness: &brightness, alpha: &alpha)
    return hue
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
    let hue = self.hue
    let elementSize = CGSize(width: ELEMENT_SIZE, height: ELEMENT_SIZE)
    for y in stride(from: CGFloat(0.0), to: rect.height, by: ELEMENT_SIZE) {
      let brightness: CGFloat = 1.0 - y / rect.height
      for x in stride(from: CGFloat(0.0), to: rect.width, by: ELEMENT_SIZE) {
        let saturation: CGFloat = x / rect.width
        let color = UIColor(hue: hue, saturation: saturation, brightness: brightness, alpha: 1.0)
        context.setFillColor(color.cgColor)
        let point = CGPoint(x: x, y: y)
        let rect = CGRect(origin: point, size: elementSize)
        context.fill(rect)
      }
    }
  }
}
