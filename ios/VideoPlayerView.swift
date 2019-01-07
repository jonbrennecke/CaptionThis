import AVFoundation
import UIKit

@objc
protocol VideoPlayerViewDelegate {
  func videoPlayerDidBecomeReadyToPlayAsset(_ asset: AVAsset)
  func videoPlayerDidFailToLoad()
  func videoPlayerDidPause()
  func videoPlayerDidUpdatePlaybackTime(_ time: CMTime, duration: CMTime)
}

@objc
class VideoPlayerView: UIView {
  @objc
  public var delegate: VideoPlayerViewDelegate?

  private var item: AVPlayerItem?
  private var playerLooper: AVPlayerLooper?

  override class var layerClass: AnyClass {
    return AVPlayerLayer.self
  }

  private var playerLayer: AVPlayerLayer {
    return layer as! AVPlayerLayer
  }

  private var player: AVQueuePlayer? {
    get {
      return playerLayer.player as? AVQueuePlayer
    }
    set {
      playerLayer.player = newValue
    }
  }

  private var timeObserverToken: Any?

  @objc
  public var asset: AVAsset? {
    didSet {
      DispatchQueue.main.async {
        guard let asset = self.asset else {
          return
        }
        let item = AVPlayerItem(asset: asset, automaticallyLoadedAssetKeys: ["playable", "hasProtectedContent", "duration"])
        item.addObserver(self, forKeyPath: #keyPath(AVPlayerItem.status), options: [.initial, .old, .new], context: nil)
        let player = self.player ?? AVQueuePlayer()
        player.replaceCurrentItem(with: item)
        let timeScale = CMTimeScale(NSEC_PER_SEC)
        let time = CMTime(seconds: 0.05, preferredTimescale: timeScale)
        self.timeObserverToken = player.addPeriodicTimeObserver(forInterval: time, queue: .main) {
          [weak self] time in
          self?.delegate?.videoPlayerDidUpdatePlaybackTime(time, duration: asset.duration)
        }
        self.playerLooper = AVPlayerLooper(player: player, templateItem: item)
        player.play()
        player.pause()
        self.item = item
        self.player = player
      }
    }
  }

  override func observeValue(forKeyPath keyPath: String?, of _: Any?, change: [NSKeyValueChangeKey: Any]?, context _: UnsafeMutableRawPointer?) {
    if keyPath == #keyPath(AVPlayerItem.status) {
      var status: AVPlayerItem.Status
      if let statusNumber = change?[.newKey] as? NSNumber {
        if let _status = AVPlayerItem.Status(rawValue: statusNumber.intValue) {
          status = _status
        } else {
          status = .unknown
        }
      } else {
        status = .unknown
      }
      switch status {
      case .readyToPlay:
        onVideoDidBecomeReadyToPlay()
        return
      case .failed:
        onVideoDidFailToLoad()
        return
      case .unknown:
        return
      }
    }
  }

  override func didMoveToSuperview() {
    super.didMoveToSuperview()
    playerLayer.videoGravity = .resizeAspectFill
  }

  @objc
  public func play() {
    DispatchQueue.main.async {
      guard let player = self.player else {
        Debug.log(message: "Playback requested, but AVPlayer is not set")
        return
      }
      player.play()
    }
  }

  @objc
  public func pause() {
    DispatchQueue.main.async {
      guard let player = self.player else {
        Debug.log(message: "Pause requested, but AVPlayer is not set")
        return
      }
      player.pause()
    }
  }

  @objc
  public func seek(to time: CMTime, completionHandler: @escaping (Bool) -> Void) {
    DispatchQueue.main.async {
      guard let player = self.player else {
        Debug.log(message: "Seek requested, but AVPlayer is not set")
        return
      }
      player.seek(to: time, completionHandler: completionHandler)
    }
  }

  @objc
  public func stop() {
    guard let player = player else {
      return
    }
    player.pause()
    player.replaceCurrentItem(with: nil)
    if let timeObserverToken = timeObserverToken {
      player.removeTimeObserver(timeObserverToken)
      self.timeObserverToken = nil
    }
  }

  private func onVideoDidBecomeReadyToPlay() {
    guard let asset = player?.currentItem?.asset else {
      return
    }
    Debug.log(message: "Video is ready to play")
    delegate?.videoPlayerDidBecomeReadyToPlayAsset(asset)
  }

  private func onVideoDidFailToLoad() {
    Debug.log(message: "Video failed to load")
    delegate?.videoPlayerDidFailToLoad()
  }
}
