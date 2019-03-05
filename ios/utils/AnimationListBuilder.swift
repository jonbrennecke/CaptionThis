import Foundation

fileprivate let STEP_DURATION = CFTimeInterval(1)

class AnimationListBuilder {
  private var steps = [[AnimationBuilderStep]]()

  private class TimingFunction {
    struct TimingStep {
      let beginTime: CFTimeInterval
      let duration: CFTimeInterval
    }

    func step(at index: Int) -> TimingStep {
      return TimingStep(beginTime: STEP_DURATION * CFTimeInterval(index * 2), duration: STEP_DURATION)
    }
  }

  public func add(steps: [AnimationBuilderStep]) -> AnimationListBuilder {
    self.steps.append(steps)
    return self
  }

  public func build() -> [CAAnimation] {
    let timingFn = TimingFunction()
    let animations = steps.enumerated().map { tuple -> [CAAnimation] in
      let (index, steps) = tuple
      let timingStep = timingFn.step(at: index)
      return steps.map { $0.animate(at: timingStep.beginTime, duration: timingStep.duration) }
    }
    return Array(animations.joined())
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
  func animate(at beginTime: CFTimeInterval, duration: CFTimeInterval) -> CAAnimation {
    return AnimationUtil.fadeIn(at: beginTime, duration: duration)
  }
}

class FadeOutAnimationStep: AnimationBuilderStep {
  func animate(at beginTime: CFTimeInterval, duration: CFTimeInterval) -> CAAnimation {
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
