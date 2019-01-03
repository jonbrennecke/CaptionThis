import AVFoundation
import UIKit

let MAX_CHARACTERS_PER_LINE: Int = 25

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
  private let containerOffsetFromBottom: CGFloat = 120
  private let containerHeight: CGFloat = 200
  private let paddingHorizontal: CGFloat = 20
  private let fontSize: CGFloat = 60

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
    textContainerLayer.masksToBounds = true
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
    var textLayers = [CATextLayer]()
    params.textSegments.forEach { segment in
      let outOfFrameTopY = textContainerLayer.frame.height * 1.25
      let inFrameTopY = textContainerLayer.frame.height * 0.75
      let inFrameMiddleY = textContainerLayer.frame.height * 0.5
      let inFrameBottomY = textContainerLayer.frame.height * 0.25
      let outOfFrameBottomY = -textContainerLayer.frame.height * 0.25
      guard let bottomTextLayer = textLayers.last else {
        let textLayer = self.addTextLayer(withParams: params, text: segment.text)
        textLayer.position.y = inFrameMiddleY
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
        return
      }
      let newString = "\(bottomTextLayer.string ?? "") \(segment.text)"
      if newString.count >= MAX_CHARACTERS_PER_LINE {
        let textLayer = addTextLayer(withParams: params, text: segment.text)
        textLayer.position.y = outOfFrameBottomY
        textLayer.opacity = 0
        let fadeInAnimation = animateFadeIn(atTime: Double(segment.timestamp))
        textLayer.add(fadeInAnimation, forKey: nil)
        let slideUpAnimation = animateSlideUp(fromPosition: textLayer.position, atTime: Double(segment.timestamp), toValue: inFrameBottomY)
        textLayer.add(slideUpAnimation, forKey: nil)
        let bottomSlideUpAnimation = animateSlideUp(fromPosition: bottomTextLayer.position, atTime: Double(segment.timestamp), toValue: inFrameTopY)
        bottomTextLayer.add(bottomSlideUpAnimation, forKey: nil)
        textLayers.forEach { layer in
          if layer == bottomTextLayer || layer == textLayer {
            return
          }
          let slideUpAnimation = animateSlideUp(fromPosition: layer.position, atTime: Double(segment.timestamp), toValue: outOfFrameTopY)
          layer.add(slideUpAnimation, forKey: nil)
          let fadeOutAnimation = animateFadeOut(atTime: Double(segment.timestamp))
          layer.add(fadeOutAnimation, forKey: nil)
        }
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
      }
      else {
        let fadeOutAnimation = animateFadeOut(atTime: Double(segment.timestamp), withDuration: 0)
        bottomTextLayer.add(fadeOutAnimation, forKey: nil)
        let textLayer = addTextLayer(withParams: params, text: segment.text)
        textLayer.position.y = textLayers.count > 1 ? inFrameBottomY : inFrameMiddleY
        textLayer.string = newString
        textLayer.opacity = 0
        let fadeInAnimation = animateFadeIn(atTime: Double(segment.timestamp), withDuration: 0)
        textLayer.add(fadeInAnimation, forKey: nil)
        textLayer.displayIfNeeded()
        textLayer.layoutIfNeeded()
        textLayers.append(textLayer)
      }
    }
    
    guard let firstSegment = params.textSegments.first else {
      return
    }
    textContainerLayer.opacity = 0.0
    let animationIn = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    animationIn.fromValue = 0.0
    animationIn.toValue = 1.0
    animationIn.fillMode = .forwards
    animationIn.isRemovedOnCompletion = false
    animationIn.beginTime = AVCoreAnimationBeginTimeAtZero + Double(firstSegment.timestamp)
    animationIn.duration = 0.3
    textContainerLayer.add(animationIn, forKey: nil)
    // TODO fade out after last segment duration is complete (+delay)
  }
  
  private func animateFadeIn(atTime beginTime: CFTimeInterval, withDuration duration: CFTimeInterval = 0.25) -> CABasicAnimation {
    let fadeInAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    fadeInAnimation.fromValue = 0.0
    fadeInAnimation.toValue = 1.0
    fadeInAnimation.fillMode = .forwards
    fadeInAnimation.isRemovedOnCompletion = false
    fadeInAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    fadeInAnimation.duration = duration
    return fadeInAnimation
  }
  
  private func animateFadeOut(atTime beginTime: CFTimeInterval, withDuration duration: CFTimeInterval = 0.25) -> CABasicAnimation {
    let fadeOutAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.opacity))
    fadeOutAnimation.toValue = 0.0
    fadeOutAnimation.fillMode = .forwards
    fadeOutAnimation.isRemovedOnCompletion = false
    fadeOutAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    fadeOutAnimation.duration = duration
    return fadeOutAnimation
  }
  
  private func animateSlideUp(
    fromPosition position: CGPoint,
    atTime beginTime: CFTimeInterval,
    toValue value: CGFloat,
    withDuration duration: CFTimeInterval = 0.25
  ) -> CABasicAnimation {
    let slideUpAnimation = CABasicAnimation(keyPath: #keyPath(CALayer.position))
    slideUpAnimation.fromValue = position
    slideUpAnimation.toValue = CGPoint(x: position.x, y: value)
    slideUpAnimation.fillMode = .forwards
    slideUpAnimation.isRemovedOnCompletion = false
    slideUpAnimation.beginTime = AVCoreAnimationBeginTimeAtZero + beginTime
    slideUpAnimation.duration = duration
    return slideUpAnimation
  }
  
  private func addTextLayer(withParams params: VideoAnimationParams, text: String) -> CATextLayer {
    let textLayer = CenteredTextLayer()
    let height = textContainerLayer.frame.height / 2
    let width = textContainerLayer.frame.width - paddingHorizontal
    textLayer.frame = CGRect(x: paddingHorizontal, y: 0, width: width, height: height)
    textLayer.alignmentMode = .left
    textLayer.fontSize = fontSize
    textLayer.truncationMode = .start
    textLayer.contentsScale = UIScreen.main.scale
    textLayer.font = params.fontFamily as CFTypeRef
    textLayer.foregroundColor = params.textColor.cgColor
    textLayer.string = text
    textContainerLayer.addSublayer(textLayer)
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
