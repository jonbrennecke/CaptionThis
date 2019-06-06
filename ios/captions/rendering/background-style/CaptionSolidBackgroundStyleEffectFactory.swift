import UIKit

class CaptionSolidBackgroundStyleEffectFactory: CaptionBackgroundStyleEffectFactory {
  let backgroundStyle: CaptionBackgroundStyle = .solid

  func createEffect(backgroundColor: UIColor, layout _: CaptionViewLayout, map: CaptionStringsMap) -> PresentationEffect {
    let animationKey = "solidBackgroundStyleEffectAnimation"
    return PresentationEffect(doEffect: { layer in
      guard let beginTime = map.getLine(byKey: .a, index: 0)?.timestamp else {
        return
      }
      let animation = AnimationUtil.fadeIn(at: beginTime)
      layer.opacity = 0
      layer.add(animation, forKey: animationKey)
      layer.backgroundColor = backgroundColor.withAlphaComponent(0.9).cgColor
      layer.masksToBounds = true
    }, undoEffect: createAnimationRemover(byKey: animationKey))
  }
}
