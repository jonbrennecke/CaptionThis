import AVFoundation
import UIKit

class VideoAnimation {
  
  private let videoComposition = AVMutableVideoComposition()
  private let mixComposition = AVMutableComposition()
  private let videoAsset: AVAsset
  private let videoTrack: AVAssetTrack
  private let audioTrack: AVAssetTrack
  private let effectLayer = CALayer()
  private let videoLayer = CALayer()
  private let parentLayer = CALayer()
  private let textContainerLayer = CALayer()
  private let containerOffsetFromBottom: CGFloat = 100
  private let containerHeight: CGFloat = 100
  private let paddingHorizontal: CGFloat = 20

  private var videoSize: CGSize {
    get {
      let originalSize = videoTrack.naturalSize
      return CGSize(width: originalSize.height, height: originalSize.width)
    }
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
    let originalSize = videoTrack.naturalSize
    let size = CGSize(width: originalSize.height, height: originalSize.width)
    let frame = CGRect(origin: CGPoint(x: 0, y: 0), size: size)
    parentLayer.frame = frame
    effectLayer.frame = frame
    videoLayer.frame = frame
    textContainerLayer.frame = CGRect(x: 0, y: containerOffsetFromBottom, width: videoSize.width, height: containerHeight)
    parentLayer.addSublayer(videoLayer)
    effectLayer.addSublayer(textContainerLayer)
    parentLayer.addSublayer(effectLayer)
  }
  
  convenience init?(withVideoAtURL videoFileURL: URL) {
    let videoAsset = AVURLAsset(url: videoFileURL, options: nil)
    self.init(withAsset: videoAsset)
  }
  
  public func animate(withParams params: VideoAnimationParams) {
    textContainerLayer.backgroundColor = params.backgroundColor.cgColor
    params.textSegments.forEach { segment in
      let textLayer = self.animateText(withParams: segment)
      textLayer.font = params.fontFamily as CFTypeRef
      textLayer.foregroundColor = params.textColor.cgColor
      self.textContainerLayer.addSublayer(textLayer)
      textLayer.displayIfNeeded()
      textLayer.layoutIfNeeded()
    }
  }
  
  private func animateText(withParams params: TextSegmentParams) -> CATextLayer {
    let fontSize: CGFloat = 60
    let textLayer = CATextLayer()
    let textOffset = -((containerHeight - fontSize) / 2 - fontSize / 10)
    textLayer.opacity = 0.0
    textLayer.frame = CGRect(x: paddingHorizontal, y: textOffset, width: videoSize.width - paddingHorizontal, height: containerHeight)
    textLayer.string = params.text
    textLayer.alignmentMode = .left
    textLayer.fontSize = fontSize
    textLayer.truncationMode = .start
    textLayer.contentsScale = UIScreen.main.scale
    let animationIn = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    animationIn.fromValue = 0.0
    animationIn.toValue = 1.0
    animationIn.fillMode = .forwards
    animationIn.isRemovedOnCompletion = false
    animationIn.beginTime = AVCoreAnimationBeginTimeAtZero + Double(params.timestamp)
    animationIn.duration = 0.1
    textLayer.add(animationIn, forKey: nil)
    let animationOut = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    animationOut.fromValue = 1.0
    animationOut.toValue = 0.0
    animationOut.fillMode = .forwards
    animationOut.isRemovedOnCompletion = false
    animationOut.beginTime = AVCoreAnimationBeginTimeAtZero + Double(params.timestamp) + Double(params.duration)
    animationOut.duration = 0.1
    textLayer.add(animationOut, forKey: nil)
    return textLayer
  }
  
  public func exportVideo(_ completionHandler: @escaping (Error?, Bool, URL?) -> ()) {
    do {
      try applyAnimationToVideo()
    }
    catch let error {
      completionHandler(error, false, nil)
      return
    }
    DispatchQueue.global(qos: .background).async {
      do {
        let exportFileURL = try FileManager.default
          .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
          .appendingPathComponent("output")
          .appendingPathExtension("mov")
        try? FileManager.default.removeItem(at: exportFileURL)
        guard let assetExport = AVAssetExportSession(asset: self.mixComposition, presetName: AVAssetExportPresetHighestQuality) else {
          Debug.log(message: "Asset export session could not be created")
          completionHandler(nil, false, nil)
          return
        }
        assetExport.videoComposition = self.videoComposition
        assetExport.outputFileType = .mov
        assetExport.outputURL = exportFileURL
        Debug.log(format: "Exporting video animation. URL = %@", exportFileURL.absoluteString)
        assetExport.exportAsynchronously {
          Debug.log(format: "Finished exporting video animation. URL = %@", exportFileURL.absoluteString)
          switch assetExport.status {
          case .failed:
            if let error = assetExport.error {
              completionHandler(error, false, nil)
              return
            }
            completionHandler(nil, false, nil)
            return
          case .completed:
            completionHandler(nil, true, exportFileURL)
            return
          case .unknown, .cancelled, .exporting, .waiting:
            completionHandler(nil, false, nil)
            return
          }
        }
      }
      catch let error {
        Debug.log(error: error)
        completionHandler(error, false, nil)
      }
    }
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
//    layerInstruction.setOpacityRamp(fromStartOpacity: 0, toEndOpacity: 1, timeRange: CMTimeRange(start: CMTime.zero, end: CMTime.zero + CMTime(seconds: 0.1, preferredTimescale: 30)))
    instruction.layerInstructions = [layerInstruction]
    videoComposition.instructions = [instruction]
    videoComposition.frameDuration = CMTimeMake(value: 1, timescale: 30) // TODO check video fps
    videoComposition.renderSize = videoSize
    videoComposition.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayers: [videoLayer, effectLayer], in: parentLayer)
  }
}
