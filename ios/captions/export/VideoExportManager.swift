import AVFoundation
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

@objc
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

  @objc
  public func exportVideo(withLocalIdentifier localIdentifier: String, style: CaptionExportStyle, textSegments: [CaptionTextSegment], duration: CFTimeInterval) {
    let task = VideoExportTask(localIdentifier: localIdentifier, style: style, textSegments: textSegments, duration: duration)
    task.delegate = self
    task.startTask()
    state = .pending(task)
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
