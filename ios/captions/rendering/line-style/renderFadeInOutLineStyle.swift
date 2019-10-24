import AVFoundation

func renderFadeInOutLineStyle(
  layer: CALayer,
  key _: CaptionRowKey,
  map _: CaptionStringsMap,
  duration _: CFTimeInterval
) {
//  let builder = CaptionAnimation.Builder()
//  let lines = map.getValues(byKey: key)!
//  for (index, _) in lines.enumerated() {
//    builder.insert(
//      in: [FadeInAnimationStep()],
//      center: [],
//      out: [FadeOutAnimationStep()],
//      index: index,
//      key: key
//    )
//  }
//  let animationKey = "lineStyleAnimation"
//  let group = CAAnimationGroup()
//  group.repeatCount = .greatestFiniteMagnitude
//  group.animations = builder.build(withMap: map)
//  group.duration = duration
//  group.isRemovedOnCompletion = false
//  group.fillMode = .forwards
//  group.beginTime = AVCoreAnimationBeginTimeAtZero
//  layer.removeAnimation(forKey: animationKey)
//  layer.add(group, forKey: animationKey)

  guard let parentLayer = layer.superlayer else {
    return
  }

//  let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
//  let animationBuilder = CaptionAnimation.Builder()
//  let lines = map.getValues(byKey: key)!
//  for (index, line) in lines.enumerated() {
//    let outOfFrameBottom = positions.getPosition(forKey: .outOfFrameBottom)
//    let inFrameTop = positions.getPosition(forKey: .inFrameTop)
//    let outOfFrameTop = positions.getPosition(forKey: .outOfFrameTop)
//    let inFrameBottomOrMiddle = positions.getPosition(
//      forKey: index == 0 && key == .a ? .inFrameMiddle : .inFrameBottom
//    )
//    let isOdd = index % 2 == 1
//    animationBuilder.insert(
//      in: [
//        FadeInAnimationStep(),
  ////        PositionAnimationStep(from: outOfFrameBottom, to: inFrameBottomOrMiddle),
//      ],
//      center: [
  ////        PositionAnimationStep(from: inFrameBottomOrMiddle, to: inFrameTop),
//      ],
//      out: [
  ////        PositionAnimationStep(from: inFrameTop, to: outOfFrameTop),
//        FadeOutAnimationStep(),
//      ],
//      index: isOdd ? index : index - 1,
//      key: key
//    )
//
//    let animation = AnimationUtil.fadeIn
//  }

//  let group = CAAnimationGroup()
//  group.repeatCount = .greatestFiniteMagnitude
//  group.animations = animationBuilder.build(withMap: map)
//  group.duration = duration
//  group.isRemovedOnCompletion = false
//  group.fillMode = .forwards
//  group.beginTime = AVCoreAnimationBeginTimeAtZero
//  layer.add(group, forKey: nil)
}
