import AVFoundation

protocol CaptionAnimationExportSessionDelegate {
  func captionAnimationExportSession(didFail _: Error?)
  func captionAnimationExportSession(didFinish _: URL)
  func captionAnimationExportSession(didUpdateProgress _: Float)
}

class CaptionAnimationExportSession {
  private enum State {
    case unstarted
    case preparingToExport
    case exporting(Timer, AVAssetExportSession)
    case finished
    case failed
  }

  private var state: State = .unstarted
  private let composition: VideoAnimationComposition

  public var delegate: CaptionAnimationExportSessionDelegate?

  init(composition: VideoAnimationComposition) {
    self.composition = composition
  }

  public func export() {
    state = .preparingToExport
    do {
      try composition.applyAnimationToVideo()
      let exportFileURL = try FileManager.default
        .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        .appendingPathComponent("output")
        .appendingPathExtension("mov")
      try? FileManager.default.removeItem(at: exportFileURL)
      guard let assetExportSession = AVAssetExportSession(asset: composition.mixComposition, presetName: AVAssetExportPresetHighestQuality) else {
        Debug.log(message: "Asset export session could not be created")
        delegate?.captionAnimationExportSession(didFail: nil)
        return
      }
      let timer = startTimer()
      state = .exporting(timer, assetExportSession)
      assetExportSession.videoComposition = composition.videoComposition
      assetExportSession.outputFileType = .mov
      assetExportSession.outputURL = exportFileURL
      Debug.log(format: "Exporting video animation. URL = %@", exportFileURL.absoluteString)
      assetExportSession.exportAsynchronously {
        Debug.log(format: "Finished exporting video animation. URL = %@", exportFileURL.absoluteString)
        switch assetExportSession.status {
        case .failed:
          let error = assetExportSession.error!
          self.delegate?.captionAnimationExportSession(didFail: error)
          return
        case .completed:
          self.state = .finished
          self.delegate?.captionAnimationExportSession(didFinish: exportFileURL)
          return
        case .unknown, .cancelled, .exporting, .waiting:
          self.delegate?.captionAnimationExportSession(didFail: nil)
          return
        }
      }
    } catch {
      state = .failed
      Debug.log(error: error)
      delegate?.captionAnimationExportSession(didFail: error)
    }
  }

  private func startTimer() -> Timer {
    let timer = Timer(timeInterval: 0.1, target: self, selector: #selector(onExportSessionProgressDidUpdate), userInfo: nil, repeats: true)
    DispatchQueue.main.async {
      RunLoop.current.add(timer, forMode: .common)
    }
    return timer
  }

  private func stop(timer: Timer) {
    timer.invalidate()
  }

  @objc
  private func onExportSessionProgressDidUpdate() {
    guard case let .exporting(_, assetExportSession) = state else {
      return
    }
    let progress = assetExportSession.progress
    delegate?.captionAnimationExportSession(didUpdateProgress: progress)
  }
}
