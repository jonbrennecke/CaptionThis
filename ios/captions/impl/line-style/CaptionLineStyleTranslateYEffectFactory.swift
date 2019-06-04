import AVFoundation

class CaptionLineStyleTranslateYEffectFactory: CaptionLineStyleEffectFactory {
  public let lineStyle: CaptionLineStyle = .translateY
  public let allEffectedKeys: [CaptionStyleImpl.LayerKey] = [.a, .b, .c]

  func createEffect(key: CaptionStyleImpl.LayerKey, map: CaptionStringsMap, duration: CFTimeInterval) -> PresentationEffect {
    let animationKey = "lineStyleAnimation"
    return PresentationEffect(doEffect: { layer in
      guard let parentLayer = layer.superlayer else {
        return
      }

      // create builder (TODO: abstract this in another function)
      let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
      let builder = CaptionAnimation.Builder()
      let lines = map.getValues(byKey: key)!
      for (index, _) in lines.enumerated() {
        let outOfFrameBottom = positions.getPosition(forKey: .outOfFrameBottom)
        let inFrameTop = positions.getPosition(forKey: .inFrameTop)
        let outOfFrameTop = positions.getPosition(forKey: .outOfFrameTop)
        let inFrameBottomOrMiddle = positions.getPosition(forKey: index == 0 && key == .a ? .inFrameMiddle : .inFrameBottom)
        builder.insert(
          in: [
            FadeInAnimationStep(),
            PositionAnimationStep(from: outOfFrameBottom, to: inFrameBottomOrMiddle),
          ],
          center: [
            PositionAnimationStep(from: inFrameBottomOrMiddle, to: inFrameTop),
          ],
          out: [
            PositionAnimationStep(from: inFrameTop, to: outOfFrameTop),
            FadeOutAnimationStep(),
          ],
          index: index,
          key: key
        )
      }

      let group = CAAnimationGroup()
      group.repeatCount = .greatestFiniteMagnitude
      group.animations = builder.build(withMap: map)
      group.duration = duration
      group.isRemovedOnCompletion = false
      group.fillMode = .forwards
      group.beginTime = AVCoreAnimationBeginTimeAtZero
      layer.add(group, forKey: animationKey)
    }, undoEffect: { layer in
      layer.removeAnimation(forKey: animationKey)
    })
  }
}
