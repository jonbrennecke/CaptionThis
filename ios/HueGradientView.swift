import UIKit

fileprivate let ELEMENT_SIZE: CGFloat = 1

@objc
class HueGradientView : UIView {
  
  override func layoutSubviews() {
    super.layoutSubviews()
    setNeedsDisplay()
    backgroundColor = .white
  }
  
  override func draw(_ rect: CGRect) {
    guard let context = UIGraphicsGetCurrentContext() else {
      return
    }
    let elementSize = CGSize(width: ELEMENT_SIZE, height: ELEMENT_SIZE)
    for x in stride(from: CGFloat(0.0), to: rect.width, by: ELEMENT_SIZE) {
      let hue: CGFloat = x / rect.width
      for y in stride(from: CGFloat(0.0), to: rect.height, by: ELEMENT_SIZE) {
        let brightness: CGFloat = 1.0
        let saturation: CGFloat = 1.0
        let color = UIColor(hue: hue, saturation: saturation, brightness: brightness, alpha: 1.0)
        context.setFillColor(color.cgColor)
        let point = CGPoint(x: x, y: y)
        let rect = CGRect(origin: point, size: elementSize)
        context.fill(rect)
      }
    }
  }
}
