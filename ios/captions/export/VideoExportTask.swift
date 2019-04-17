import Photos

protocol VideoExportTaskDelegate {
  func videoExportTask(didEncounterError _: VideoExportTask.Error)
  func videoExportTask(didFinishTask placeholder: PHObjectPlaceholder)
  func videoExportTask(didUpdateProgress progress: Float, time: CFAbsoluteTime)
}

class VideoExportTask {
  private enum State {
    case unstarted
    case pending(ExportTaskState, CFAbsoluteTime)
    case finished
    case failed
  }

  private enum ExportTaskState {
    case fetchingAVAsset
    case exportingCaptionAnimation(CaptionAnimationExportSession)
  }

  public enum Error: GlobalError {
    case failedToFindAsset
    case failedToCreateComposition
    case failedToFindOrCreateAlbumWithError(GlobalError)
    case failedToCreateAsset
    case failedToCreateAssetWithError(GlobalError)
    case noVideoTrack
    case compositionFailed
    case compositionFailedWithError(GlobalError)
    case compositionErrorNoURL
    case invalidState
  }

  private var state: State = .unstarted
  private let style: CaptionExportStyle
  private let textSegments: [CaptionTextSegment]
  private let duration: CFTimeInterval
  private let localIdentifier: String
  private var requestID: PHImageRequestID?
  public var delegate: VideoExportTaskDelegate?

  public init(localIdentifier: String, style: CaptionExportStyle, textSegments: [CaptionTextSegment], duration: CFTimeInterval) {
    self.localIdentifier = localIdentifier
    self.textSegments = textSegments
    self.style = style
    self.duration = duration
  }

  deinit {
    if let id = requestID {
      PHImageManager.default().cancelImageRequest(id)
    }
  }

  public func startTask() {
    let startTime = CFAbsoluteTimeGetCurrent()
    state = .pending(.fetchingAVAsset, startTime)
    let options = PHFetchOptions()
    let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: [localIdentifier], options: options)
    guard let photosAsset = fetchResult.firstObject else {
      Debug.log(format: "Could not find PHAsset. Local identifier = %@", localIdentifier)
      delegate?.videoExportTask(didEncounterError: .failedToFindAsset)
      return
    }
    requestID = PHImageManager.default().requestAVAsset(forVideo: photosAsset, options: nil) { asset, _, _ in
      guard let asset = asset else {
        Debug.log(format: "Request for AVAsset failed. Local identifier = %@", self.localIdentifier)
        self.delegate?.videoExportTask(didEncounterError: .failedToFindAsset)
        return
      }
      self.exportVideo(withAsset: asset)
    }
  }

  private func exportVideo(withAsset asset: AVAsset) {
    guard case let .pending(.fetchingAVAsset, startTime) = state else {
      delegate?.videoExportTask(didEncounterError: .invalidState)
      return
    }
    guard let composition = VideoAnimationComposition(withAsset: asset) else {
      delegate?.videoExportTask(didEncounterError: .failedToCreateComposition)
      return
    }
    let videoTracks = asset.tracks(withMediaType: .video)
    guard let videoTrack = videoTracks.first else {
      delegate?.videoExportTask(didEncounterError: .noVideoTrack)
      return
    }
    let naturalSize = videoTrack.naturalSize
    let transform = videoTrack.preferredTransform
    let rotatedSize = naturalSize.applying(transform)
    let size = CGSize(width: abs(rotatedSize.width), height: abs(rotatedSize.height))
    let orientation = OrientationUtil.orientation(forAsset: asset)
    let dimensions = VideoDimensions(size: size, orientation: orientation)

    // TODO: cleanup
    let layout = VideoAnimationLayerLayout.layoutForExport(dimensions: dimensions, style: style)
    let exportStyle = CaptionExportStyle(
      wordStyle: style.wordStyle,
      lineStyle: style.lineStyle,
      textAlignment: style.textAlignment,
      backgroundStyle: style.backgroundStyle,
      backgroundColor: style.backgroundColor,
      font: style.font.withSize(CGFloat(layout.fontSize)),
      textColor: style.textColor,
      viewSize: style.viewSize)
    
    let captionLayer = CaptionLayer(style: exportStyle, layout: layout, textSegments: textSegments, duration: duration)
    captionLayer.frame = frame(forComposition: composition, layout: layout)
    captionLayer.resizeSublayers()
    captionLayer.timeOffset = 0
    captionLayer.speed = 1
    captionLayer.beginTime = AVCoreAnimationBeginTimeAtZero
    captionLayer.duration = duration
    composition.add(effectLayer: captionLayer)
    let exportSession = CaptionAnimationExportSession(composition: composition)
    exportSession.delegate = self
    exportSession.export()
    state = .pending(.exportingCaptionAnimation(exportSession), startTime)
  }

  private func frame(forComposition composition: VideoAnimationComposition, layout: VideoAnimationLayerLayout) -> CGRect {
    var offsetFromBottom: CGFloat = composition.videoSize.height * 0.1
    switch composition.orientation {
    case .left, .right, .leftMirrored, .rightMirrored:
      offsetFromBottom = 50
      break
    default:
      break
    }
    let height = CGFloat(layout.frameHeight)
    let width = composition.videoSize.width
    return CGRect(x: 0, y: composition.videoSize.height - offsetFromBottom - height, width: width, height: height)
  }

  private func createVideoAsset(forURL url: URL) {
    PhotosAlbumUtil.withAlbum { result in
      switch result {
      case let .err(error):
        Debug.log(message: "Failed to find/create album")
        self.delegate?.videoExportTask(didEncounterError: .failedToFindOrCreateAlbumWithError(error))
        break
      case let .ok(album):
        var assetPlaceholder: PHObjectPlaceholder?
        PHPhotoLibrary.shared().performChanges({
          if #available(iOS 9.0, *) {
            let assetRequest = PHAssetCreationRequest.creationRequestForAssetFromVideo(atFileURL: url)
            guard
              let placeholder = assetRequest?.placeholderForCreatedAsset,
              let albumChangeRequest = PHAssetCollectionChangeRequest(for: album)
            else {
              Debug.log(format: "Asset placeholder could not be created. URL = %@", url.path)
              self.delegate?.videoExportTask(didEncounterError: .failedToCreateAsset)
              return
            }
            albumChangeRequest.addAssets([placeholder] as NSArray)
            assetPlaceholder = placeholder
          } else {
            fatalError("This app only supports iOS 9.0 or above.")
          }
        }) { success, error in
          Debug.log(format: "Finished creating asset for video. Success = %@", success ? "true" : "false")
          if let error = error {
            Debug.log(error: error)
            self.delegate?.videoExportTask(didEncounterError: .failedToCreateAssetWithError(error))
            return
          }
          guard success, let assetPlaceholder = assetPlaceholder else {
            self.delegate?.videoExportTask(didEncounterError: .failedToCreateAsset)
            return
          }
          self.delegate?.videoExportTask(didFinishTask: assetPlaceholder)
        }
        break
      }
    }
  }
}

extension VideoExportTask: CaptionAnimationExportSessionDelegate {
  func captionAnimationExportSession(didFail error: GlobalError?) {
    guard let error = error else {
      delegate?.videoExportTask(didEncounterError: .compositionFailed)
      return
    }
    Debug.log(error: error)
    delegate?.videoExportTask(didEncounterError: .compositionFailedWithError(error))
    state = .failed
  }

  func captionAnimationExportSession(didFinish exportFileURL: URL) {
    createVideoAsset(forURL: exportFileURL)
    state = .finished
  }

  func captionAnimationExportSession(didUpdateProgress progress: Float) {
    guard case let .pending(_, startTime) = state else {
      return
    }
    let executionTime = CFAbsoluteTimeGetCurrent() - startTime
    delegate?.videoExportTask(didUpdateProgress: progress, time: executionTime)
  }
}
