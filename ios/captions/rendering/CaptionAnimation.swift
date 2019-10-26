import Foundation

fileprivate let ANIM_IN_OUT_DURATION = CFTimeInterval(0.5)
fileprivate let ANIM_FINAL_LINE_DURATION = CFTimeInterval(2)

struct CaptionAnimation {
  let animationsIn: [AnimationBuilderStep]
  let animationsCenter: [AnimationBuilderStep]
  let animationsOut: [AnimationBuilderStep]
  let index: Int
  let key: CaptionRowKey
}

protocol AnimationBuilderStep {
  func animate(at: CFTimeInterval, duration: CFTimeInterval) -> CAAnimation
}

class BoundsAnimationStep: AnimationBuilderStep {
  private let fromBounds: CGRect
  private let toBounds: CGRect

  init(from fromBounds: CGRect, to toBounds: CGRect) {
    self.fromBounds = fromBounds
    self.toBounds = toBounds
  }

  func animate(at beginTime: CFTimeInterval, duration: CFTimeInterval) -> CAAnimation {
    return AnimationUtil.animateBounds(from: fromBounds, to: toBounds, at: beginTime, duration: duration)
  }
}

class FadeInAnimationStep: AnimationBuilderStep {
  func animate(at beginTime: CFTimeInterval, duration stepDuration: CFTimeInterval) -> CAAnimation {
    let duration = stepDuration * 0.5
    return AnimationUtil.fadeIn(at: beginTime + duration, duration: duration)
  }
}

class FadeOutAnimationStep: AnimationBuilderStep {
  func animate(at beginTime: CFTimeInterval, duration stepDuration: CFTimeInterval) -> CAAnimation {
    let duration = stepDuration * 0.5
    return AnimationUtil.fadeOut(at: beginTime, duration: duration)
  }
}

class PositionAnimationStep: AnimationBuilderStep {
  private let fromPosition: CGPoint
  private let toPosition: CGPoint

  init(from fromPosition: CGPoint, to toPosition: CGPoint) {
    self.fromPosition = fromPosition
    self.toPosition = toPosition
  }

  func animate(at beginTime: CFTimeInterval, duration: CFTimeInterval) -> CAAnimation {
    return AnimationUtil.animatePosition(from: fromPosition, to: toPosition, at: beginTime, duration: duration)
  }
}

func build(animations: [CaptionAnimation], withMap map: CaptionStringsMap) -> [CAAnimation] {
  let nestedAnimations = animations.map { animation -> [CAAnimation] in
    guard let lines = map.segmentsByRow[animation.key] else {
      return []
    }
    let line = lines[animation.index]
    guard let timedLine = Timed.from(array: line) else {
      return []
    }
    let (key: nextKey, index: nextIndex) = next(key: animation.key, index: animation.index)
    let (key: lastKey, index: lastIndex) = next(key: nextKey, index: nextIndex)

    guard let nextLineTimestamp: CFTimeInterval = { key, index in
      if let lines = map.segmentsByRow[key], index < lines.count {
        return Timed.from(array: lines[index])?.timestamp
      }
      return timedLine.endTimestamp
    }(nextKey, nextIndex) else {
      return []
    }

    guard let lastLineTimestamp: CFTimeInterval = { key, index, previousKey, previousIndex in
      if let lines = map.segmentsByRow[key], index < lines.count {
        return Timed.from(array: lines[index])?.timestamp
      }
      if let lines = map.segmentsByRow[previousKey], previousIndex < lines.count {
        return Timed.from(array: lines[previousIndex])?.endTimestamp
      }
      return timedLine.endTimestamp + ANIM_FINAL_LINE_DURATION
    }(lastKey, lastIndex, nextKey, nextIndex) else {
      return []
    }

    let clampFn = { timestamp in
      clamp(timestamp - ANIM_IN_OUT_DURATION, from: 0, to: timestamp)
    }

    let animationsIn = animation.animationsIn.map {
      $0.animate(at: clampFn(timedLine.timestamp), duration: ANIM_IN_OUT_DURATION)
    }
    let animationsCenter = animation.animationsCenter.map {
      $0.animate(at: clampFn(nextLineTimestamp), duration: ANIM_IN_OUT_DURATION)
    }
    let animationsOut = animation.animationsOut.map {
      $0.animate(at: clampFn(lastLineTimestamp), duration: ANIM_IN_OUT_DURATION)
    }
    return Array([
      animationsIn,
      animationsCenter,
      animationsOut,
    ].joined())
  }
  return Array(nestedAnimations.joined())
}

fileprivate func next(key: CaptionRowKey, index: Int) -> (key: CaptionRowKey, index: Int) {
  switch key.nextKey {
  case .a:
    return (key: .a, index: index + 1)
  case .b:
    return (key: .b, index: index)
  case .c:
    return (key: .c, index: index)
  }
}
