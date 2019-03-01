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
