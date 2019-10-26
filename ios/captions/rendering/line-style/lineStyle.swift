import AVFoundation

fileprivate let ANIM_IN_OUT_DURATION = CFTimeInterval(0.5)

@objc
enum CaptionLineStyle: Int {
  case fadeInOut
  case translateY
}

func renderLineStyle(
  style: CaptionStyle,
  layer: CALayer,
  duration: CFTimeInterval,
  rowSize: CGSize,
  numberOfRows: Int,
  stringSegmentRows: [CaptionStringSegmentRow],
  map: CaptionStringsMap
) {
  switch style.lineStyle {
  case .translateY:
    let timedStringSegmentRows = stringSegmentRows.map({ Timed.from(array: $0) }).compactMap({ $0 })
    for (index, _) in timedStringSegmentRows.enumerated() {
      if let lineStyleLayer = makeTranslateUpLineStyleLayer(
        rowSize: rowSize,
        parentSize: layer.frame.size,
        style: style,
        duration: duration,
        timedStringSegmentRows: timedStringSegmentRows,
        index: index,
        map: map
      ) {
        layer.addSublayer(lineStyleLayer)
      }
    }
  case .fadeInOut:
    let groupedSegments = makeGroupedCaptionStringSegmentRows(
      rows: stringSegmentRows,
      numberOfRowsToDisplay: numberOfRows
    )
    for timedRows in groupedSegments {
      for (index, stringSegments) in timedRows.data.enumerated() {
        let rowKey = CaptionRowKey.from(index: index)
        let positions = CaptionPresetLinePositions(for: rowSize, in: layer.frame.size)
        let lineStyleLayer = makeFadeInOutLineStyleLayer(
          within: layer.frame,
          positions: positions,
          style: style,
          duration: duration,
          rowKey: rowKey,
          stringSegments: stringSegments,
          map: map,
          timedRows: timedRows
        )
        layer.addSublayer(lineStyleLayer)
      }
    }
  }
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
  let positionKey: CaptionPresetLinePositions.Key = indexIsOdd ? .inFrameBottom : .inFrameTop
  let position = positions.getPosition(forKey: positionKey)
  lineStyleLayer.position = position
  let wordStyleLayer = makeWordStyleLayer(
    within: lineStyleLayer.frame,
    rowKey: rowKey,
    stringSegments: stringSegments,
    style: style,
    map: map,
    duration: duration
  )
  wordStyleLayer.opacity = 0
  wordStyleLayer.add({
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.animations = [
      AnimationUtil.fadeIn(at: timedRows.timestamp, duration: ANIM_IN_OUT_DURATION),
      AnimationUtil.fadeOut(at: clamp(timestamp: timedRows.endTimestamp), duration: ANIM_IN_OUT_DURATION),
    ]
    group.duration = duration
    group.isRemovedOnCompletion = false
    group.fillMode = .forwards
    group.beginTime = AVCoreAnimationBeginTimeAtZero
    return group
  }(), forKey: nil)
  lineStyleLayer.addSublayer(wordStyleLayer)
  return lineStyleLayer
}

func makeTranslateUpLineStyleLayer(
  rowSize: CGSize,
  parentSize: CGSize,
  style: CaptionStyle,
  duration: CFTimeInterval,
  timedStringSegmentRows: Array<Timed<Array<CaptionStringSegment>>>,
  index: Int,
  map: CaptionStringsMap
) -> CALayer? {
  if index >= timedStringSegmentRows.count {
    return nil
  }
  let timedStringSegments = timedStringSegmentRows[index]
  let rowKey = CaptionRowKey.from(index: index)
  let lineStyleLayer = CALayer()
  lineStyleLayer.frame = CGRect(origin: .zero, size: parentSize)
  let wordStyleLayer = makeWordStyleLayer(
    within: lineStyleLayer.frame,
    rowKey: rowKey,
    stringSegments: timedStringSegments.data,
    style: style,
    map: map,
    duration: duration
  )
  let positions = CaptionPresetLinePositions(for: rowSize, in: lineStyleLayer.frame.size)
  wordStyleLayer.opacity = 0
  wordStyleLayer.add({
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.animations = buildAnimations(
      timedStringSegmentRows: timedStringSegmentRows,
      index: index,
      positions: positions
    )
    group.duration = duration
    group.isRemovedOnCompletion = false
    group.fillMode = .forwards
    group.beginTime = AVCoreAnimationBeginTimeAtZero
    return group
  }(), forKey: nil)
  lineStyleLayer.addSublayer(wordStyleLayer)
  return lineStyleLayer
}

fileprivate func buildAnimations(
  timedStringSegmentRows: Array<Timed<Array<CaptionStringSegment>>>,
  index: Int,
  positions: CaptionPresetLinePositions
) -> [CABasicAnimation] {
  let timedStringSegments = timedStringSegmentRows[index]
  let outOfFrameBottom = positions.getPosition(forKey: .outOfFrameBottom)
  let inFrameTop = positions.getPosition(forKey: .inFrameTop)
  let outOfFrameTop = positions.getPosition(forKey: .outOfFrameTop)
  let inFrameBottomOrMiddle = positions.getPosition(forKey: index == 0 ? .inFrameMiddle : .inFrameBottom)
  var animations = [CABasicAnimation]()
  animations.append(
    AnimationUtil.fadeIn(
      at: clamp(timestamp: timedStringSegments.timestamp),
      duration: ANIM_IN_OUT_DURATION
    )
  )
  animations.append(
    AnimationUtil.animatePosition(
      from: outOfFrameBottom,
      to: inFrameBottomOrMiddle,
      at: clamp(timestamp: timedStringSegments.timestamp),
      duration: ANIM_IN_OUT_DURATION
    )
  )
  if let nextTimedStringSegments = (index + 1) < timedStringSegmentRows.count
    ? timedStringSegmentRows[index + 1]
    : nil {
    animations.append(
      AnimationUtil.animatePosition(
        from: inFrameBottomOrMiddle,
        to: inFrameTop,
        at: clamp(timestamp: nextTimedStringSegments.timestamp),
        duration: ANIM_IN_OUT_DURATION
      )
    )
  }
  if let lastTimedStringSegments = (index + 2) < timedStringSegmentRows.count
    ? timedStringSegmentRows[index + 2]
    : nil {
    animations.append(
      AnimationUtil.animatePosition(
        from: inFrameTop,
        to: outOfFrameTop,
        at: clamp(timestamp: lastTimedStringSegments.timestamp),
        duration: ANIM_IN_OUT_DURATION
      )
    )
    animations.append(
      AnimationUtil.fadeOut(
        at: clamp(timestamp: lastTimedStringSegments.timestamp),
        duration: ANIM_IN_OUT_DURATION
      )
    )
  }
  return animations
}

fileprivate func clamp(timestamp: CFTimeInterval) -> CFTimeInterval {
  clamp(timestamp - ANIM_IN_OUT_DURATION, from: 0, to: timestamp)
}
