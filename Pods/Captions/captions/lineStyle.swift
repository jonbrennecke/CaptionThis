import AVFoundation
import UIKit

fileprivate let ANIM_IN_OUT_DURATION = CFTimeInterval(0.5)

func renderCaptionLines(
  style: CaptionStyle,
  layer: CALayer,
  duration: CFTimeInterval,
  rowSize: CGSize,
  stringSegmentLines: [CaptionStringSegmentLine]
) {
  switch style.lineStyle {
  case .translateUp:
    let timedStringSegmentLines = stringSegmentLines.map({ Timed.from(array: $0) }).compactMap({ $0 })
    for (index, _) in timedStringSegmentLines.enumerated() {
      if let lineStyleLayer = makeTranslateUpLineStyleLayer(
        rowSize: rowSize,
        parentSize: layer.frame.size,
        style: style,
        duration: duration,
        timedStringSegmentRows: timedStringSegmentLines,
        index: index
      ) {
        layer.addSublayer(lineStyleLayer)
      }
    }
  case let .fadeInOut(numberOfLines, padding):
    let groupedSegments = groupCaptionStringSegmentLines(
      lines: stringSegmentLines,
      numberOfLinesToDisplay: numberOfLines
    )
    let paddingLayer = makeLineStylePaddingLayer(
      padding: padding,
      emUnitSize: calculateSizeOfEmUnit(font: style.textStyle.font, rowSize: rowSize),
      parentLayerSize: layer.frame.size
    )
    layer.addSublayer(paddingLayer)
    for timedLines in groupedSegments {
      for (index, stringSegments) in timedLines.data.enumerated() {
        let lineStyleLayer = makeFadeInOutLineStyleLayer(
          within: paddingLayer.frame,
          rowSize: rowSize,
          style: style,
          duration: duration,
          currentLineIndexInGroup: index,
          numberOfLinesPerGroup: numberOfLines,
          stringSegments: stringSegments,
          timedLines: timedLines
        )
        paddingLayer.addSublayer(lineStyleLayer)
      }
    }
  }
}

func makeLineStylePaddingLayer(
  padding: CaptionStyle.LineStyle.Padding,
  emUnitSize em: CGSize,
  parentLayerSize size: CGSize
) -> CALayer {
  let layer = CALayer()
  let paddingTop = em.height * CGFloat(padding.vertical)
  layer.bounds = CGRect(
    origin: .zero,
    size: CGSize(width: size.width, height: size.height - paddingTop * 2)
  )
  layer.position = CGPoint(x: 0, y: paddingTop)
  layer.anchorPoint = .zero
  return layer
}

func calculateSizeOfEmUnit(font: UIFont, rowSize: CGSize) -> CGSize {
  let attributes: [NSAttributedString.Key: Any] = [
    .font: font,
  ]
  let attributedString = NSAttributedString(string: "—", attributes: attributes)
  return attributedString.boundingRect(with: rowSize, options: [], context: nil).size
}

func makeFadeInOutLineStyleLayer(
  within bounds: CGRect,
  rowSize: CGSize,
  style: CaptionStyle,
  duration: CFTimeInterval,
  currentLineIndexInGroup: Int,
  numberOfLinesPerGroup: Int,
  stringSegments: [CaptionStringSegment],
  timedLines: Timed<Array<CaptionStringSegmentLine>>
) -> CALayer {
  let position = CGPoint(
    x: bounds.size.width / 2,
    y: (bounds.size.height * (CGFloat(currentLineIndexInGroup) + 0.5)) / CGFloat(numberOfLinesPerGroup)
  )
  let lineStyleLayer = CALayer()
  lineStyleLayer.frame = CGRect(origin: bounds.origin, size: rowSize)
  lineStyleLayer.position = position
  let wordStyleLayer = makeWordStyleLayer(
    within: lineStyleLayer.frame,
    stringSegments: stringSegments,
    style: style,
    duration: duration
  )
  wordStyleLayer.opacity = 0
  wordStyleLayer.add({
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.animations = [
      AnimationUtil.fadeIn(at: timedLines.timestamp, duration: ANIM_IN_OUT_DURATION),
      AnimationUtil.fadeOut(at: clamp(timestamp: timedLines.endTimestamp), duration: ANIM_IN_OUT_DURATION),
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
  index: Int
) -> CALayer? {
  if index >= timedStringSegmentRows.count {
    return nil
  }
  let timedStringSegments = timedStringSegmentRows[index]
  let lineStyleLayer = CALayer()
  lineStyleLayer.frame = CGRect(origin: .zero, size: parentSize)
  let wordStyleLayer = makeWordStyleLayer(
    within: lineStyleLayer.frame,
    stringSegments: timedStringSegments.data,
    style: style,
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
