import AVFoundation

class CaptionLineStyleFadeInOutEffectFactory: CaptionLineStyleEffectFactory {
  public let lineStyle: CaptionLineStyle = .fadeInOut
  public let allEffectedRows: [CaptionRowKey] = [.a, .b]

  func createEffect(key: CaptionRowKey, map: CaptionStringsMap, duration: CFTimeInterval) -> PresentationEffect {
    // create builder (TODO: abstract this in another function)
    let builder = CaptionAnimation.Builder()
    let lines = map.getValues(byKey: key)!
    for (index, _) in lines.enumerated() {
      builder.insert(
        in: [FadeInAnimationStep()],
        center: [],
        out: [FadeOutAnimationStep()],
        index: index,
        key: key
      )
    }

    let animationKey = "lineStyleAnimation"
    return PresentationEffect(doEffect: { layer in
      let group = CAAnimationGroup()
      group.repeatCount = .greatestFiniteMagnitude
      group.animations = builder.build(withMap: map)
      group.duration = duration
      group.isRemovedOnCompletion = false
      group.fillMode = .forwards
      group.beginTime = AVCoreAnimationBeginTimeAtZero
      layer.removeAnimation(forKey: animationKey)
      layer.add(group, forKey: animationKey)
    }, undoEffect: createAnimationRemover(byKey: animationKey))
  }
}
