import Speech
import AVFoundation

enum SpeechTranscriptionError : Error {
  case invalidAsset
}

protocol GroupedSpeechTranscriptionRequestDelegate {
  func groupedSpeechTranscriptionRequestDidNotDetectSpeech()
  func groupedSpeechTranscriptionRequestDidTerminate()
  func groupedSpeechTranscriptionRequestDidFinalizeTranscription(results: [SFSpeechRecognitionResult], inTime: CFAbsoluteTime)
}

class GroupedSpeechTranscriptionRequest : NSObject {
  
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
  private let delegate: GroupedSpeechTranscriptionRequestDelegate
  private weak var recognizer: SFSpeechRecognizer! // TODO: should be optional? not optional!
  
  init?(forAsset asset: AVAsset, recognizer: SFSpeechRecognizer, delegate: GroupedSpeechTranscriptionRequestDelegate) {
    self.asset = asset
    guard case let .ok((assetReader, assetReaderOutput)) = AudioUtil.createAssetReaderAndOutput(withAsset: asset) else {
      return nil
    }
    self.recognizer = recognizer
    self.delegate = delegate
    self.assetReader = assetReader
    self.assetReaderOutput = assetReaderOutput
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
      guard case .unstarted(_) = state else {
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
}

extension GroupedSpeechTranscriptionRequest: SFSpeechRecognitionTaskDelegate {
  func speechRecognitionTask(_ task: SFSpeechRecognitionTask, didFinishSuccessfully success: Bool) {
    Debug.log(format: "Speech recognizer finished task. Success == %@", success ? "true" : "false")
    if success {
      return
    }
    if let error = task.error as NSError? {
      if error.code == 203, error.localizedDescription == "Retry" {
        delegate.groupedSpeechTranscriptionRequestDidNotDetectSpeech()
        return
      }
      Debug.log(error: error)
    }
    delegate.groupedSpeechTranscriptionRequestDidTerminate()
  }
  
  func speechRecognitionTaskWasCancelled(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition task was cancelled.")
  }
  
  func speechRecognitionTaskFinishedReadingAudio(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition finished reading audio input.")
  }
  
  func speechRecognitionTask(_ task: SFSpeechRecognitionTask, didFinishRecognition result: SFSpeechRecognitionResult) {
    guard case .pending(var tasks, let startTime) = state else {
      // TODO: invalid state
      return
    }
    let maybeIndex = tasks.firstIndex { state in
      guard case .pending(_) = state else {
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
    
    // Check if all tasks are finalized
    let areAllTasksFinalized = tasks.allSatisfy { state in
      guard case .final(_) = state else {
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
      delegate.groupedSpeechTranscriptionRequestDidFinalizeTranscription(results: results, inTime: executionTime)
    }
    else {
      startNextTask()
    }
  }
  
  func speechRecognitionTask(_: SFSpeechRecognitionTask, didHypothesizeTranscription transcription: SFTranscription) {
    // NOTE: unused
  }
}
