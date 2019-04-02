import Foundation

fileprivate let STEP_DURATION = CFTimeInterval(1)

class CaptionAnimationBuilder {
  public struct TimedStep {
    let beginTime: CFTimeInterval
    let duration: CFTimeInterval
    let animation: AnimationBuilderStep
  }

  private var timedSteps = [TimedStep]()

  public func insert(_ animation: AnimationBuilderStep, at index: Int) -> CaptionAnimationBuilder {
    let beginTime = STEP_DURATION * CFTimeInterval(index * 2)
    let duration = STEP_DURATION
    let timedStep = TimedStep(beginTime: beginTime, duration: duration, animation: animation)
    return insert(timedStep)
  }

  public func insert(_ animations: [AnimationBuilderStep], at index: Int) -> CaptionAnimationBuilder {
    let steps = animations.map { animation -> TimedStep in
      let beginTime = STEP_DURATION * CFTimeInterval(index * 2)
      let duration = STEP_DURATION
      return TimedStep(beginTime: beginTime, duration: duration, animation: animation)
    }
    timedSteps.append(contentsOf: steps)
    return self
  }

  public func insert(_ timedStep: TimedStep) -> CaptionAnimationBuilder {
    timedSteps.append(timedStep)
    return self
  }

  public func build() -> [CAAnimation] {
    return timedSteps.map { step in
      step.animation.animate(at: step.beginTime, duration: step.duration)
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
