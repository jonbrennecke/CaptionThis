import Foundation

@objc
enum PlaybackControllerState: Int {
  case playing
  case paused

  public var isPaused: Bool {
    return self == .paused
  }

  public var isPlaying: Bool {
    return self == .playing
  }
}
