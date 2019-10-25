import AVFoundation

func renderTranslateYLineStyle(
  layer: CALayer,
  key: CaptionRowKey,
  map: CaptionStringsMap,
  duration: CFTimeInterval,
  orderedSegments _: OrderedCaptionStringSegmentRows
) {
  guard let parentLayer = layer.superlayer else {
    return
  }
  let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
  let animationBuilder = CaptionAnimation.Builder()
  guard let rowSegments = map.segmentsByRow[key] else {
    return
  }
  for (index, _) in rowSegments.enumerated() {
    let outOfFrameBottom = positions.getPosition(forKey: .outOfFrameBottom)
    let inFrameTop = positions.getPosition(forKey: .inFrameTop)
    let outOfFrameTop = positions.getPosition(forKey: .outOfFrameTop)
    let inFrameBottomOrMiddle = positions.getPosition(forKey: index == 0 && key == .a ? .inFrameMiddle : .inFrameBottom)
    animationBuilder.insert(
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
  group.animations = animationBuilder.build(withMap: map)
  group.duration = duration
  group.isRemovedOnCompletion = false
  group.fillMode = .forwards
  group.beginTime = AVCoreAnimationBeginTimeAtZero
  layer.add(group, forKey: nil)
}
