import AVFoundation

fileprivate let ANIM_IN_OUT_DURATION = CFTimeInterval(0.5)

func clamp(timestamp: CFTimeInterval) -> CFTimeInterval {
  clamp(timestamp - ANIM_IN_OUT_DURATION, from: 0, to: timestamp)
}

func makeFadeInOutLineStyleLayer(
  within bounds: CGRect,
  positions: CaptionPresetLinePositions,
  style: CaptionStyle,
  duration: CFTimeInterval,
  rowKey: CaptionRowKey,
  stringSegments: [CaptionStringSegment],
  map: CaptionStringsMap,
  timedRows: Timed<Array<CaptionStringSegmentRow>>
) -> CALayer {
  let lineStyleLayer = CALayer()
  lineStyleLayer.frame = bounds
  let indexIsOdd = rowKey.index % 2 == 1
  let positionKey: CaptionPresetLinePositions.Key = indexIsOdd ? .inFrameTop : .inFrameBottom
  let position = positions.getPosition(forKey: positionKey)
  lineStyleLayer.position = CGPoint(x: bounds.origin.x + position.x, y: bounds.origin.y - position.y)
  let animations = [
    AnimationUtil.fadeIn(at: timedRows.timestamp, duration: ANIM_IN_OUT_DURATION),
    AnimationUtil.fadeOut(at: clamp(timestamp: timedRows.endTimestamp), duration: ANIM_IN_OUT_DURATION),
  ]
  let group = CAAnimationGroup()
  group.repeatCount = .greatestFiniteMagnitude
  group.animations = animations
  group.duration = duration
  group.isRemovedOnCompletion = false
  group.fillMode = .forwards
  group.beginTime = AVCoreAnimationBeginTimeAtZero
  let wordStyleLayer = makeWordStyleLayer(
    within: lineStyleLayer.frame,
    rowKey: rowKey,
    stringSegments: stringSegments,
    style: style,
    map: map,
    duration: duration
  )
  wordStyleLayer.opacity = 0
  wordStyleLayer.add(group, forKey: nil)
  lineStyleLayer.addSublayer(wordStyleLayer)
  return lineStyleLayer
}
