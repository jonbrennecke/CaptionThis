import AVFoundation
import Photos

@objc
protocol VideoExportManagerDelegate {
  @objc(videoExportManagerDidFinishWithObjectPlaceholder:)
  func videoExportManager(didFinish _: PHObjectPlaceholder)
  @objc(videoExportManagerDidFailWithError:)
  func videoExportManager(didFail _: Error)
}

@objc
class VideoExportManager: NSObject {
  private enum TaskState {
    case unstarted
    case pending(VideoExportTask)
    case final
  }

  private var state: TaskState = .unstarted

  @objc
  public var delegate: VideoExportManagerDelegate?

  @objc(sharedInstance)
  public static let shared = VideoExportManager()

  @objc
  public func exportVideo(withLocalIdentifier localIdentifier: String, params: VideoAnimationBridgeParams) {
    let task = VideoExportTask(localIdentifier: localIdentifier, model: params.model())
    task.delegate = self
    task.startTask()
    state = .pending(task)
  }
}

extension VideoExportManager: VideoExportTaskDelegate {
  func videoExportTask(didUpdateProgress percent: Float, time: CFAbsoluteTime) {
    // TODO
  }
  
  func videoExportTask(didEncounterError error: VideoExportTask.Error) {
    delegate?.videoExportManager(didFail: error)
  }

  func videoExportTask(didFinishTask placeholder: PHObjectPlaceholder) {
    delegate?.videoExportManager(didFinish: placeholder)
  }
}
