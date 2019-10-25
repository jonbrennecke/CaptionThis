import AVFoundation

fileprivate let ANIM_IN_OUT_DURATION = CFTimeInterval(0.5)

func clamp(timestamp: CFTimeInterval) -> CFTimeInterval {
  clamp(timestamp - ANIM_IN_OUT_DURATION, from: 0, to: timestamp)
}

func renderFadeInOutLineStyle(
  style: CaptionStyle,
  duration: CFTimeInterval,
  getLayerByRow: (CaptionRowKey) -> CALayer,
  orderedSegments: OrderedCaptionStringSegmentRows,
  map: CaptionStringsMap
) {
  for timedRows in orderedSegments {
    let rows = timedRows.data
    for (index, stringSegments) in rows.enumerated() {
      let rowKey = CaptionRowKey.from(index: index)
      let layer = getLayerByRow(rowKey)
      guard let parentLayer = layer.superlayer else {
        return
      }
      let positions = CaptionPresetLinePositions(layer: layer, parentLayer: parentLayer)
      let indexIsOdd = index % 2 == 1
      let positionKey: CaptionPresetLinePositions.Key = indexIsOdd ? .inFrameBottom : .inFrameTop
      layer.position = positions.getPosition(forKey: positionKey)
      layer.opacity = 1
      let animations = [
        AnimationUtil.fadeIn(at: timedRows.timestamp, duration: ANIM_IN_OUT_DURATION),
        AnimationUtil.fadeOut(at: clamp(timestamp: timedRows.endTimestamp), duration: ANIM_IN_OUT_DURATION),
      ]
      
//      let textLayer = makeNoWordStyleTextStyleLayer(style: style, layer: layer, stringSegments: stringSegments)
      let textLayer = makeAnimatedWordTextStyleLayer(
        key: rowKey,
        segments: stringSegments,
        map: map,
        layer: layer,
        style: style,
        duration: duration
      )
      textLayer.opacity = 0
      let group = CAAnimationGroup()
      group.repeatCount = .greatestFiniteMagnitude
      group.animations = animations
      group.duration = duration
      group.isRemovedOnCompletion = false
      group.fillMode = .forwards
      group.beginTime = AVCoreAnimationBeginTimeAtZero
      textLayer.add(group, forKey: nil)
      layer.addSublayer(textLayer)
    }
  }
}
