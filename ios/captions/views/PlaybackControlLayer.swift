import UIKit

enum PlaybackControlLayerState {
  case playing
  case paused
  
  public var isPaused: Bool {
    return self == .paused
  }
  
  public var isPlaying: Bool {
    return self == .playing
  }
}

protocol PlaybackControlLayer: AnyObject {
  var state: PlaybackControlLayerState { get set }
  func resetAnimation()
}

extension PlaybackControlLayer where Self: CALayer {
  private func triggerReset() {
    let mediaTimeBeforeReset = convertTime(CACurrentMediaTime(), from: nil)
    let stateBeforeReset = state
    resetAnimation()
    guard case .playing = stateBeforeReset else {
      return
    }
    resume()
    seekTo(time: mediaTimeBeforeReset)
  }

  internal func restart() {
    Debug.log(message: "Restarting animation")
    removeAllAnimations()
    resetAnimation()
    beginTime = convertTime(CACurrentMediaTime(), from: nil)
    if !state.isPlaying {
      resume()
    }
    seekTo(time: .leastNonzeroMagnitude)
  }
  
  internal func seekTo(time: CFTimeInterval) {
    let stateBeforeReset = state
    Debug.log(format: "Animation seeking to %0.2fs", time)
    removeAllAnimations()
    resetAnimation()
    if case .playing = stateBeforeReset {
      speed = 1
      timeOffset = 0
      beginTime = 0
      beginTime = convertTime(CACurrentMediaTime(), from: nil)
      timeOffset = time
    } else {
      let pausedTimeOffset = timeOffset
      timeOffset = 0
      beginTime = 0
      beginTime = convertTime(CACurrentMediaTime(), from: nil) - pausedTimeOffset
      timeOffset = time
    }
    state = stateBeforeReset
  }
  
  internal func pause() {
    if state.isPaused {
      return
    }
    Debug.log(message: "Pausing animation")
    state = .paused
    speed = 0
    timeOffset = convertTime(CACurrentMediaTime(), from: nil)
  }

  internal func resume() {
    if !state.isPaused {
      return
    }
    Debug.log(message: "Resuming paused animation")
    let pausedTimeOffset = timeOffset
    speed = 1
    timeOffset = 0
    beginTime = 0
    let timeSincePaused = convertTime(CACurrentMediaTime(), from: nil) - pausedTimeOffset
    beginTime = timeSincePaused
    state = .playing
  }
}
