import AVFoundation
import Speech

class FileSpeechTranscriptionRequest: NSObject, SpeechTranscriptionRequest {
  private enum State {
    case unstarted
    case pending([TaskState], CFAbsoluteTime)
    case completed
    case failed
  }

  private enum TaskState {
    case unstarted(SFSpeechAudioBufferRecognitionRequest)
    case pending(SFSpeechRecognitionTask)
    case final(SFSpeechRecognitionResult)
  }

  private var state: State = .unstarted
  private let asset: AVAsset
  private let assetReader: AVAssetReader
  private let assetReaderOutput: AVAssetReaderTrackOutput
  private let delegate: SpeechTranscriptionRequestDelegate
  private weak var recognizer: SFSpeechRecognizer! // TODO: should be optional? not optional!

  init?(forAsset asset: AVAsset, recognizer: SFSpeechRecognizer, delegate: SpeechTranscriptionRequestDelegate) {
    self.asset = asset
    guard case let .ok((assetReader, assetReaderOutput)) = AudioUtil.createAssetReaderAndOutput(withAsset: asset) else {
      return nil
    }
    self.recognizer = recognizer
    self.delegate = delegate
    self.assetReader = assetReader
    self.assetReaderOutput = assetReaderOutput
    super.init()
  }

  public func startTranscription() -> Result<(), SpeechTranscriptionError> {
    let startTime = CFAbsoluteTimeGetCurrent()
    let requestResult = createRequests()
    if case let .ok(requests) = requestResult {
      let tasks: [TaskState] = requests.map { .unstarted($0) }
      state = .pending(tasks, startTime)
      startNextTask()
    } else if case let .err(error) = requestResult {
      Debug.log(message: "Failed to create speech requests")
      state = .failed
      return .err(error)
    }
    return .ok(())
  }

  private func startNextTask() {
    guard case .pending(var tasks, let startTime) = state else {
      Debug.log(message: "Invalid state: startNextTask called while not in 'pending' state")
      state = .failed
      return
    }
    let maybeIndex = tasks.firstIndex { state in
      guard case .unstarted = state else {
        return false
      }
      return true
    }
    guard let index = maybeIndex else {
      state = .completed
      return
    }
    guard case let .unstarted(request) = tasks[index] else {
      Debug.log(message: "Invalid state")
      state = .completed
      return
    }
    Debug.log(message: "Starting speech recognition task")
    let recognitionTask = recognizer.recognitionTask(with: request, delegate: self)
    tasks[index] = .pending(recognitionTask)
    state = .pending(tasks, startTime)
  }

  private func createRequests() -> Result<[SFSpeechAudioBufferRecognitionRequest], SpeechTranscriptionError> {
    let audioAssetTracks = asset.tracks(withMediaType: .audio)
    guard let audioAssetTrack = audioAssetTracks.last else {
      Debug.log(message: "No audio track provided.")
      return .err(.invalidAsset)
    }
    let timeRanges = AudioUtil.splitTimeRanges(withAssetTrack: audioAssetTrack)
    var requests = [SFSpeechAudioBufferRecognitionRequest]()
    for (index, timeRange) in timeRanges.enumerated() {
      if index > 0 {
        assetReaderOutput.reset(forReadingTimeRanges: [timeRange as NSValue])
      } else {
        assetReader.timeRange = timeRange
        assetReader.startReading()
      }
      let request = createRequest()
      while assetReader.status == .reading {
        guard let sampleBuffer = assetReaderOutput.copyNextSampleBuffer() else {
          break
        }
        guard CMSampleBufferIsValid(sampleBuffer), let desc = CMSampleBufferGetFormatDescription(sampleBuffer),
          CMAudioFormatDescriptionGetStreamBasicDescription(desc) != nil else {
          Debug.log(message: "Received invalid sample buffer")
          continue
        }
        request.appendAudioSampleBuffer(sampleBuffer)
      }
      request.endAudio()
      requests.append(request)
    }
    assetReader.cancelReading()
    return .ok(requests)
  }

  private func createRequest() -> SFSpeechAudioBufferRecognitionRequest {
    let request = SFSpeechAudioBufferRecognitionRequest()
    request.shouldReportPartialResults = false
    return request
  }
  
  private func checkIfFinalized(tasks: [TaskState], startTime: CFAbsoluteTime) {
    let areAllTasksFinalized = tasks.allSatisfy { state in
      guard case .final = state else {
        return false
      }
      return true
    }
    if areAllTasksFinalized {
      var results = [SFSpeechRecognitionResult]()
      for case let .final(result) in tasks {
        results.append(result)
      }
      let executionTime = CFAbsoluteTimeGetCurrent() - startTime
      delegate.speechTranscriptionRequest(didFinalizeTranscriptionResults: results, inTime: executionTime)
    } else {
      startNextTask()
    }
  }
}

extension FileSpeechTranscriptionRequest: SFSpeechRecognitionTaskDelegate {
  func speechRecognitionTask(_ task: SFSpeechRecognitionTask, didFinishSuccessfully success: Bool) {
    Debug.log(format: "Speech recognizer finished task. Success == %@", success ? "true" : "false")
    if success {
      delegate.speechTranscriptionRequestDidEnd()
      return
    }
    if let error = task.error as NSError? {
      Debug.log(format: "Speech recognition task failed. Error.localizedDescription = %@", error.localizedDescription)
      if error.code == 203, error.localizedDescription == "Retry" {
        // NOTE: if this is not the first video ignore the retry error
        // (e.g. if the video is just slightly longer than the cutoff duration, the 2nd segment will commonly have no speech
        if case .pending(var tasks, let startTime) = state, tasks.count > 1 {
          let maybeIndex = tasks.firstIndex { state in
            if case let .pending(t) = state, t == task {
              return true
            }
            return false
          }
          guard let index = maybeIndex else {
            // TODO
            return
          }
          tasks.remove(at: index)
          state = .pending(tasks, startTime)
          checkIfFinalized(tasks: tasks, startTime: startTime)
          delegate.speechTranscriptionRequestDidEnd()
          return
        }
        delegate.speechTranscriptionRequestDidNotDetectSpeech()
        return
      }
      Debug.log(error: error)
    }
    guard case let .pending(_, startTime) = state else {
      delegate.speechTranscriptionRequestDidEnd()
      return
    }
    let executionTime = CFAbsoluteTimeGetCurrent() - startTime
    Debug.log(format: "Speech recognition task failed. Execution time = %0.2f seconds", executionTime)
    delegate.speechTranscriptionRequestDidFail()
  }

  func speechRecognitionTaskWasCancelled(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition task was cancelled.")
  }

  func speechRecognitionTaskFinishedReadingAudio(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition finished reading audio input.")
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didFinishRecognition result: SFSpeechRecognitionResult) {
    guard case .pending(var tasks, let startTime) = state else {
      // TODO: invalid state
      return
    }
    let maybeIndex = tasks.firstIndex { state in
      guard case .pending = state else {
        return false
      }
      return true
    }
    guard let index = maybeIndex else {
      // TODO: invalid state
      return
    }
    guard case .pending = tasks[index] else {
      // TODO: invalid state
      return
    }
    tasks[index] = .final(result)
    state = .pending(tasks, startTime)
    checkIfFinalized(tasks: tasks, startTime: startTime)
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didHypothesizeTranscription _: SFTranscription) {
    // NOTE: unused; FileSpeechTranscriptionRequest does not generate partial results
  }
}
