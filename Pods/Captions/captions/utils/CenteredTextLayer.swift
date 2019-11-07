import AVFoundation

// https://stackoverflow.com/questions/4765461/vertically-align-text-in-a-catextlayer/41518502#41518502
public class CenteredTextLayer: CATextLayer {
  public override func draw(in ctx: CGContext) {
    let yDiff = (bounds.size.height - fontSize) / 2 - fontSize / 10
    ctx.saveGState()
    ctx.translateBy(x: 0.0, y: yDiff)
    super.draw(in: ctx)
    ctx.restoreGState()
  }
}
