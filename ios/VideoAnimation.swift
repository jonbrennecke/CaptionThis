import AVFoundation
import UIKit

class VideoAnimation {
  
  private let videoComposition = AVMutableVideoComposition()
  private let mixComposition = AVMutableComposition()
  private let videoAsset: AVAsset
  private let videoTrack: AVAssetTrack
  private let audioTrack: AVAssetTrack
  private let effectLayer: CALayer
  private let videoLayer: CALayer
  private let parentLayer: CALayer
  
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
    parentLayer = CALayer()
    parentLayer.frame = frame
    effectLayer = CALayer()
    effectLayer.frame = frame
    videoLayer = CALayer()
    videoLayer.frame = frame
    parentLayer.addSublayer(videoLayer)
    parentLayer.addSublayer(effectLayer)
  }
  
  convenience init?(withVideoAtURL videoFileURL: URL) {
    let videoAsset = AVURLAsset(url: videoFileURL, options: nil)
    self.init(withAsset: videoAsset)
  }
  
  public func addTextOverlay(withParams params: TextOverlayParams) {
    let textContainerLayer = CALayer()
    let containerOffset: CGFloat = 100
    let containerHeight: CGFloat = 100
    let fontSize: CGFloat = 60
    let size = videoSize()
    textContainerLayer.frame = CGRect(x: 0, y: containerOffset, width: size.width, height: containerHeight)
    textContainerLayer.backgroundColor = ThemeColors.white.cgColor
    let textLayer = CATextLayer()
    let textOffset = -((containerHeight - fontSize) / 2 - fontSize / 10)
    textLayer.frame = CGRect(x: 0, y: textOffset, width: size.width, height: containerHeight)
    textLayer.string = params.text
    textLayer.foregroundColor = ThemeColors.darkPurple.cgColor
    textLayer.alignmentMode = .center
    textLayer.fontSize = fontSize
    textContainerLayer.addSublayer(textLayer)
    effectLayer.addSublayer(textContainerLayer)
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
  
  private func videoSize() -> CGSize {
    let originalSize = videoTrack.naturalSize
    return CGSize(width: originalSize.height, height: originalSize.width)
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
    videoComposition.frameDuration = CMTimeMake(value: 1, timescale: 30) // TODO check video fps
    videoComposition.renderSize = videoSize()
    videoComposition.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: videoLayer, in: parentLayer)
  }
}
