import AVFoundation
import Captions
import Photos

@objc
protocol VideoExportManagerDelegate {
  @objc(videoExportManagerDidFinishWithObjectPlaceholder:)
  func videoExportManager(didFinish _: PHObjectPlaceholder)
  @objc(videoExportManagerDidFailWithError:)
  func videoExportManager(didFail _: Error)
  @objc(videoExportManagerDidDidUpdateProgress:)
  func videoExportManager(didUpdateProgress _: Float)
}

@objc(HSVideoExportManager)
class VideoExportManager: NSObject {
  private enum State {
    case ready
    case pending(VideoExportTask)
  }

  private var state: State = .ready

  @objc
  public var delegate: VideoExportManagerDelegate?

  @objc(sharedInstance)
  public static let shared = VideoExportManager()

  @objc(HSExportVideoResult)
  enum ExportVideoResult: Int {
    case failedToParseCaptionStyleJSON
    case success
  }

  @objc(exportVideoWithAssetID:style:textSegments:duration:viewSize:)
  public func exportVideo(
    assetID: String,
    captionStyleJSON: CaptionStyleJSON,
    textSegmentsJSON: [CaptionTextSegmentJSON],
    duration: CFTimeInterval,
    viewSize: CGSize
  ) -> ExportVideoResult {
    guard let captionStyle = captionStyleJSON.captionStyle else {
      return .failedToParseCaptionStyleJSON
    }
    let textSegments = textSegmentsJSON.map({ $0.textSegment })
    let task = VideoExportTask(
      assetID: assetID,
      style: captionStyle,
      textSegments: textSegments,
      duration: duration,
      viewSize: viewSize
    )
    task.delegate = self
    task.startTask()
    state = .pending(task)
    return .success
  }
}

extension VideoExportManager: VideoExportTaskDelegate {
  func videoExportTask(didUpdateProgress progress: Float, time _: CFAbsoluteTime) {
    delegate?.videoExportManager(didUpdateProgress: progress)
  }

  func videoExportTask(didEncounterError error: VideoExportTask.Error) {
    delegate?.videoExportManager(didFail: error)
    state = .ready
  }

  func videoExportTask(didFinishTask placeholder: PHObjectPlaceholder, time: CFAbsoluteTime) {
    Debug.log(format: "Finished export in %0.2fs", time)
    delegate?.videoExportManager(didFinish: placeholder)
    state = .ready
  }
}
