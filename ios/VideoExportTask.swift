import Photos

protocol VideoExportTaskDelegate {
  func videoExportTask(didEncounterError _: VideoExportTask.Error)
  func videoExportTask(didFinishTask placeholder: PHObjectPlaceholder)
  func videoExportTask(didUpdateProgress percent: Float, time: CFAbsoluteTime)
}

class VideoExportTask {
  private enum State {
    case unstarted
    case pending([ExportTaskState], CFAbsoluteTime)
    case completed
    case failed
  }

  private enum ExportTaskState {
    case unstarted
    case pending
    case final
  }

  public enum Error: GlobalError {
    case failedToFindAsset
    case failedToCreateComposition
    case failedToFindOrCreateAlbumWithError(GlobalError)
    case failedToCreateAsset
    case failedToCreateAssetWithError(GlobalError)
    case noVideoTrack
    case compositionError(GlobalError)
    case compositionErrorNoURL
  }

  private var state: State = .unstarted
  private let model: VideoAnimationLayerModel
  private let localIdentifier: String
  private var requestID: PHImageRequestID?
  public var delegate: VideoExportTaskDelegate?

  public init(localIdentifier: String, model: VideoAnimationLayerModel) {
    self.localIdentifier = localIdentifier
    self.model = model
  }
  
  deinit {
    if let id = requestID {
      PHImageManager.default().cancelImageRequest(id)
    }
  }

  public func startTask() {
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
    // TODO save requestID
  }

  private func exportVideo(withAsset asset: AVAsset) {
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
    let layout = VideoAnimationLayerLayout.layoutForExport(dimensions: dimensions, model: model)
    let animationLayer = VideoAnimationLayer(layout: layout, model: model)
    animationLayer.frame = frame(forComposition: composition, layout: layout)
    animationLayer.update(model: model, layout: layout)
    animationLayer.beginTime = AVCoreAnimationBeginTimeAtZero
    animationLayer.timeOffset = 0
    animationLayer.speed = 1
    composition.add(effectLayer: animationLayer)
    composition.exportVideo { error, _, url in
      if let error = error {
        self.delegate?.videoExportTask(didEncounterError: .compositionError(error))
        return
      }
      guard let url = url else {
        self.delegate?.videoExportTask(didEncounterError: .compositionErrorNoURL)
        return
      }
      self.createVideoAsset(forURL: url)
    }
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
    let height = layout.frameHeight
    let width = composition.videoSize.width
    return CGRect(x: 0, y: offsetFromBottom, width: width, height: CGFloat(height))
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
