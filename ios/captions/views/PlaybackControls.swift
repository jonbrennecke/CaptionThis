import UIKit

@objc
protocol PlaybackControls {
  var playbackLayer: PlaybackControlLayer & CALayer { get }
  @objc func resume()
  @objc func pause()
  @objc func restart()
  @objc func seekTo(time: CFTimeInterval)
}

// extension PlaybackControls {
//  func resume() {
//    playbackLayer.resume()
//  }
//
//  func pause() {
//    playbackLayer.pause()
//  }
//
//  func restart() {
//    playbackLayer.restart()
//  }
//
//  func seekTo(time: CFTimeInterval) {
//    playbackLayer.seekTo(time: time)
//  }
// }
