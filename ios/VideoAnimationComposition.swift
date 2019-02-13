import AVFoundation

class VideoAnimationComposition : NSObject {
  
  // TODO: ideally this would be in a different class (e.g. VideoAnimationCompositionExportSession)
  private enum ExportState {
    case unstarted
    case preparingToExport
    case exporting(Timer, AVAssetExportSession)
    case finished
    case failed
  }
  
  private var state: ExportState = .unstarted
  
  private let videoComposition = AVMutableVideoComposition()
  private var mixComposition = AVMutableComposition()
  private let videoAsset: AVAsset
  private let videoTrack: AVAssetTrack
  private let audioTrack: AVAssetTrack
  private let effectLayer = CALayer()
  private let videoLayer = CALayer()
  private let parentLayer = CALayer()

  public var videoSize: CGSize {
    let size = videoTrack.naturalSize.applying(videoTrack.preferredTransform)
    return CGSize(width: abs(size.width), height: abs(size.height))
  }

  public var orientation: UIImage.Orientation {
    return OrientationUtil.orientation(forAsset: videoAsset)
  }

  init?(withAsset asset: AVAsset) {
    videoAsset = asset
    guard let videoTrack = asset.tracks(withMediaType: .video).first else {
      Debug.log(message: "Asset has no video track")
      return nil
    }
    self.videoTrack = videoTrack
    guard let audioTrack = videoAsset.tracks(withMediaType: .audio).first else {
      Debug.log(message: "Asset has no audio track.")
      return nil
    }
    self.audioTrack = audioTrack
    super.init()
    let frame = CGRect(origin: .zero, size: videoSize)
    parentLayer.frame = frame
    parentLayer.contentsScale = UIScreen.main.scale
    effectLayer.frame = frame
    effectLayer.contentsScale = UIScreen.main.scale
    videoLayer.frame = frame
    videoLayer.contentsScale = UIScreen.main.scale
    parentLayer.addSublayer(videoLayer)
    parentLayer.addSublayer(effectLayer)
  }

  convenience init?(withVideoAtURL videoFileURL: URL) {
    let videoAsset = AVURLAsset(url: videoFileURL, options: nil)
    self.init(withAsset: videoAsset)
  }

  public func add(effectLayer layer: CALayer) {
    effectLayer.addSublayer(layer)
  }

  public func exportVideo(_ completionHandler: @escaping (Error?, Bool, URL?) -> Void) {
    state = .preparingToExport
    do {
      try applyAnimationToVideo()
    } catch {
      state = .failed
      completionHandler(error, false, nil)
      return
    }
    DispatchQueue.main.async {
//    DispatchQueue.global(qos: .background).async {
      do {
        let exportFileURL = try FileManager.default
          .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
          .appendingPathComponent("output")
          .appendingPathExtension("mov")
        try? FileManager.default.removeItem(at: exportFileURL)
        guard let assetExportSession = AVAssetExportSession(asset: self.mixComposition, presetName: AVAssetExportPresetHighestQuality) else {
          Debug.log(message: "Asset export session could not be created")
          completionHandler(nil, false, nil)
          return
        }
        let timer = Timer(timeInterval: 0.1, target: self, selector: #selector(self.onExportSessionProgressDidUpdate), userInfo: nil, repeats: true)
//        let timer = Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: #selector(self.onExportSessionProgressDidUpdate), userInfo: nil, repeats: true)
        RunLoop.current.add(timer, forMode: .common)
        self.state = .exporting(timer, assetExportSession)
        assetExportSession.videoComposition = self.videoComposition
        assetExportSession.outputFileType = .mov
        assetExportSession.outputURL = exportFileURL
        Debug.log(format: "Exporting video animation. URL = %@", exportFileURL.absoluteString)
        assetExportSession.exportAsynchronously {
          Debug.log(format: "Finished exporting video animation. URL = %@", exportFileURL.absoluteString)
          switch assetExportSession.status {
          case .failed:
            if let error = assetExportSession.error {
              completionHandler(error, false, nil)
              return
            }
            completionHandler(nil, false, nil)
            return
          case .completed:
            self.state = .finished
            completionHandler(nil, true, exportFileURL)
            return
          case .unknown, .cancelled, .exporting, .waiting:
            completionHandler(nil, false, nil)
            return
          }
        }
      } catch {
        Debug.log(error: error)
        completionHandler(error, false, nil)
      }
    }
  }
  
  @objc
  private func onExportSessionProgressDidUpdate() {
    guard case let .exporting(_, assetExportSession) = state else {
      return
    }
    let progress = assetExportSession.progress
    print(progress)
  }

  private func applyAnimationToVideo() throws {
    guard let mixCompositionAudioTrack = mixComposition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) else {
      Debug.log(message: "Unable to add audio track.")
      return
    }
    try mixCompositionAudioTrack.insertTimeRange(audioTrack.timeRange, of: audioTrack, at: CMTime.zero)
    guard let mixCompositionVideoTrack = mixComposition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else {
      Debug.log(message: "Unable to add video track.")
      return
    }
    guard let videoTrack = videoAsset.tracks(withMediaType: .video).first else {
      Debug.log(message: "Video track could not be found in video asset")
      return
    }
    try mixCompositionVideoTrack.insertTimeRange(videoTrack.timeRange, of: videoTrack, at: CMTime.zero)
    mixCompositionVideoTrack.preferredTransform = videoTrack.preferredTransform
    let instruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRangeMake(start: CMTime.zero, duration: mixComposition.duration)
    guard let mixVideoTrack = mixComposition.tracks(withMediaType: .video).first else {
      Debug.log(message: "Video track could not be found in composition")
      return
    }
    let layerInstruction = AVMutableVideoCompositionLayerInstruction(assetTrack: mixVideoTrack)
    layerInstruction.setTransform(videoTrack.preferredTransform, at: CMTime.zero)
    instruction.layerInstructions = [layerInstruction]
    videoComposition.instructions = [instruction]
    videoComposition.frameDuration = CMTimeMake(value: 1, timescale: 30) // TODO: check video fps
    videoComposition.renderSize = videoSize
    videoComposition.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayers: [videoLayer, effectLayer], in: parentLayer)
  }
}
