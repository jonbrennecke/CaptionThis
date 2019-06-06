import UIKit

@objc
protocol PlaybackController: AnyObject {
  var state: PlaybackControllerState { get set }
  
  func resetAnimation()

  @objc func resume()
  @objc func pause()
  @objc func restart()
  @objc func seekTo(time: CFTimeInterval)
}

extension PlaybackController where Self: UIView {
  private func triggerReset(layer: CALayer) {
    let mediaTimeBeforeReset = layer.convertTime(CACurrentMediaTime(), from: nil)
    let stateBeforeReset = state
    resetAnimation()
    guard case .playing = stateBeforeReset else {
      return
    }
    resume()
    seekTo(time: mediaTimeBeforeReset)
  }

  internal func restart(layer: CALayer) {
    Debug.log(message: "Restarting animation")
    layer.removeAllAnimations()
    resetAnimation()
    layer.beginTime = layer.convertTime(CACurrentMediaTime(), from: nil)
    if !state.isPlaying {
      resume()
    }
    seekTo(time: .leastNonzeroMagnitude)
  }

  internal func seekTo(layer: CALayer, time: CFTimeInterval) {
    let stateBeforeReset = state
    Debug.log(format: "Animation seeking to %0.2fs", time)
    layer.removeAllAnimations()
    resetAnimation()
    if case .playing = stateBeforeReset {
      layer.speed = 1
      layer.timeOffset = 0
      layer.beginTime = 0
      layer.beginTime = layer.convertTime(CACurrentMediaTime(), from: nil)
      layer.timeOffset = time
    } else {
      let pausedTimeOffset = layer.timeOffset
      layer.timeOffset = 0
      layer.beginTime = 0
      layer.beginTime = layer.convertTime(CACurrentMediaTime(), from: nil) - pausedTimeOffset
      layer.timeOffset = time
    }
    state = stateBeforeReset
  }

  internal func pause(layer: CALayer) {
    if state.isPaused {
      return
    }
    Debug.log(message: "Pausing animation")
    state = .paused
    layer.speed = 0
    layer.timeOffset = layer.convertTime(CACurrentMediaTime(), from: nil)
  }

  internal func resume(layer: CALayer) {
    if !state.isPaused {
      return
    }
    Debug.log(message: "Resuming paused animation")
    let pausedTimeOffset = layer.timeOffset
    layer.speed = 1
    layer.timeOffset = 0
    layer.beginTime = 0
    let timeSincePaused = layer.convertTime(CACurrentMediaTime(), from: nil) - pausedTimeOffset
    layer.beginTime = timeSincePaused
    state = .playing
  }
}
