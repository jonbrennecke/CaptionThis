import Foundation

fileprivate let ANIM_IN_OUT_DURATION = CFTimeInterval(0.5)
fileprivate let ANIM_FINAL_LINE_DURATION = CFTimeInterval(2)

struct CaptionAnimation {
  public typealias Key = CaptionStyleImpl.LayerKey

  private let animationsIn: [AnimationBuilderStep]
  private let animationsCenter: [AnimationBuilderStep]
  private let animationsOut: [AnimationBuilderStep]
  private let index: Int
  private let key: Key

  init(
    in animationsIn: [AnimationBuilderStep],
    center animationsCenter: [AnimationBuilderStep],
    out animationsOut: [AnimationBuilderStep],
    index: Int,
    key: Key
  ) {
    self.animationsIn = animationsIn
    self.animationsCenter = animationsCenter
    self.animationsOut = animationsOut
    self.index = index
    self.key = key
  }

  public class Builder {
    public typealias Key = CaptionAnimation.Key

    private var animations = [CaptionAnimation]()

    public func insert(
      in animationsIn: [AnimationBuilderStep],
      center animationsCenter: [AnimationBuilderStep],
      out animationsOut: [AnimationBuilderStep],
      index: Int,
      key: Key
    ) {
      let animation = CaptionAnimation(
        in: animationsIn,
        center: animationsCenter,
        out: animationsOut,
        index: index,
        key: key
      )
      animations.append(animation)
    }

    public func next(key: Key, index: Int) -> (key: Key, index: Int) {
      switch key.nextKey {
      case .a:
        return (key: .a, index: index + 1)
      case .b:
        return (key: .b, index: index)
      case .c:
        return (key: .c, index: index)
      }
    }

    public func build(withMap map: CaptionStringsMap) -> [CAAnimation] {
      let nestedAnimations = animations.map { animation -> [CAAnimation] in
        guard let lines = map.getValues(byKey: animation.key) else {
          return []
        }
        let line = lines[animation.index]
        let (key: nextKey, index: nextIndex) = next(key: animation.key, index: animation.index)
        let (key: lastKey, index: lastIndex) = next(key: nextKey, index: nextIndex)

        let nextLineTimestamp: CFTimeInterval = { key, index, line in
          if let lines = map.getValues(byKey: key), index < lines.count {
            let line = lines[index]
            return line.timestamp
          }
          return line.timestamp + line.duration
        }(nextKey, nextIndex, line)

        let lastLineTimestamp: CFTimeInterval = { key, index, previousKey, previousIndex, line in
          if let lines = map.getValues(byKey: key), index < lines.count {
            let line = lines[index]
            return line.timestamp
          }
          if let lines = map.getValues(byKey: previousKey), previousIndex < lines.count {
            let line = lines[previousIndex]
            return line.timestamp + line.duration
          }
          return line.timestamp + line.duration + ANIM_FINAL_LINE_DURATION
        }(lastKey, lastIndex, nextKey, nextIndex, line)

        let clampFn = { timestamp in
          clamp(timestamp - ANIM_IN_OUT_DURATION, from: 0, to: timestamp)
        }

        let animationsIn = animation.animationsIn.map { $0.animate(at: clampFn(line.timestamp), duration: ANIM_IN_OUT_DURATION) }
        let animationsCenter = animation.animationsCenter.map { $0.animate(at: clampFn(nextLineTimestamp), duration: ANIM_IN_OUT_DURATION) }
        let animationsOut = animation.animationsOut.map { $0.animate(at: clampFn(lastLineTimestamp), duration: ANIM_IN_OUT_DURATION) }
        return Array([
          animationsIn,
          animationsCenter,
          animationsOut,
        ].joined())
      }
      return Array(nestedAnimations.joined())
    }
  }
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
