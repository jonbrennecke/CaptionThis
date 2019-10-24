import AVFoundation

func renderFadeInOutLineStyle(
  layer: CALayer,
  key: CaptionRowKey,
  map: CaptionStringsMap,
  duration: CFTimeInterval,
  orderedSegments: OrderedCaptionStringSegmentRows
) {
  guard let parentLayer = layer.superlayer else {
    return
  }
  let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
  layer.backgroundColor = UIColor.red.cgColor
  layer.opacity = 1
//  layer.position = bounds.position
  
//  let animationBuilder = CaptionAnimation.Builder()
//  var animations = [CABasicAnimation]()
//  for timedRows in orderedSegments {
//    animations.append(contentsOf: [
//      AnimationUtil.fadeIn(at: timedRows.timestamp),
//      AnimationUtil.fadeOut(at: timedRows.endTimestamp)
//    ])
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
