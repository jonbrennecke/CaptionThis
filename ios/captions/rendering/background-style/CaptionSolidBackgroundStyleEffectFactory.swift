import AVFoundation
import UIKit

class CaptionSolidBackgroundStyleEffectFactory: CaptionBackgroundStyleEffectFactory {
  let backgroundStyle: CaptionBackgroundStyle = .solid

  func createEffect(backgroundColor: UIColor, map: CaptionStringsMap) -> PresentationEffect {
    let animationKey = "solidBackgroundStyleEffectAnimation"
    return PresentationEffect(doEffect: { layer in
      guard let beginTime = map.getLine(byKey: .a, index: 0)?.timestamp else {
        return
      }
      let backgroundLayer = CALayer()
      backgroundLayer.frame = layer.bounds
      backgroundLayer.opacity = 0
      backgroundLayer.backgroundColor = backgroundColor.withAlphaComponent(0.9).cgColor
      backgroundLayer.masksToBounds = true
      layer.insertSublayer(backgroundLayer, at: 0)
      let animation = AnimationUtil.fadeIn(at: beginTime - 0.25)
      backgroundLayer.add(animation, forKey: animationKey)
    }, undoEffect: createAnimationRemover(byKey: animationKey))
  }
}
