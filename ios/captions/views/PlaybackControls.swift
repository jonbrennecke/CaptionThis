import UIKit

protocol PlaybackControls {
  var playbackLayer: PlaybackControlLayer & CALayer { get }
  func resume()
  func pause()
  func restart()
  func seekTo(time: CFTimeInterval)
}

extension PlaybackControls {
  func resume() {
    playbackLayer.resume()
  }
  
  func pause() {
    playbackLayer.pause()
  }
  
  func restart() {
    playbackLayer.restart()
  }
  
  func seekTo(time: CFTimeInterval) {
    playbackLayer.seekTo(time: time)
  }
}
