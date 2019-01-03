import Foundation

// https://github.com/cemolcay/CenterTextLayer/blob/master/Source/CenterTextLayer.swift
public class CenteredTextLayer: CATextLayer {
  
  public override init() {
    super.init()
  }
  
  public override init(layer: Any) {
    super.init(layer: layer)
  }
  
  public required init(coder aDecoder: NSCoder) {
    super.init(layer: aDecoder)
  }
  
  public override func draw(in ctx: CGContext) {
    #if os(iOS) || os(tvOS)
    let multiplier = CGFloat(1)
    #elseif os(OSX)
    let multiplier = CGFloat(-1)
    #endif
    let yDiff = (bounds.size.height - ((string as? NSAttributedString)?.size().height ?? fontSize)) / 2 * multiplier
    
    ctx.saveGState()
    ctx.translateBy(x: 0.0, y: yDiff)
    super.draw(in: ctx)
    ctx.restoreGState()
  }
}
