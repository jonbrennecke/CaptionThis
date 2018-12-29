import AVFoundation
import UIKit

@objc
protocol VideoPlayerViewDelegate {
  func videoPlayerDidBecomeReadyToPlayAsset(_ asset: AVAsset)
  func videoPlayerDidFailToLoad()
}

@objc
class VideoPlayerView: UIView {
  
  @objc
  public var delegate: VideoPlayerViewDelegate?
  
  private var item: AVPlayerItem?
  
  override class var layerClass: AnyClass {
    get {
      return AVPlayerLayer.self
    }
  }
  
  private var playerLayer: AVPlayerLayer {
    get {
      return self.layer as! AVPlayerLayer
    }
  }
  
  private var player: AVPlayer? {
    get {
      return playerLayer.player
    }
    set {
      playerLayer.player = newValue
    }
  }
  
  @objc
  public var asset: AVAsset? {
    didSet {
      DispatchQueue.main.async {
        guard let asset = self.asset else {
          return
        }
        self.item = AVPlayerItem(asset: asset, automaticallyLoadedAssetKeys: ["playable", "hasProtectedContent"])
        self.item!.addObserver(self, forKeyPath: #keyPath(AVPlayerItem.status), options: [.initial, .old, .new], context: nil)
        if let player = self.player {
          player.replaceCurrentItem(with: self.item)
        }
        else {
          self.player = AVPlayer(playerItem: self.item)
        }
        self.play()
      }
    }
  }
  
  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == #keyPath(AVPlayerItem.status) {
      var status: AVPlayerItem.Status
      if let statusNumber = change?[.newKey] as? NSNumber {
        if let _status = AVPlayerItem.Status(rawValue: statusNumber.intValue) {
          status = _status
        }
        else {
          status = .unknown
        }
      } else {
        status = .unknown
      }
      switch status  {
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
  public func seek(to time: CMTime, completionHandler: @escaping (Bool) -> ()) {
    DispatchQueue.main.async {
      guard let player = self.player else {
        Debug.log(message: "Seek requested, but AVPlayer is not set")
        return
      }
      player.seek(to: time, completionHandler: completionHandler)
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
