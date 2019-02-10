import AVFoundation
import Speech

protocol SpeechTranscriptionRequest {
  func startTranscription() -> Result<(), SpeechTranscriptionError>
}

class LiveSpeechTranscriptionRequest: NSObject, SpeechTranscriptionRequest {
  private enum State {
    case unstarted
    case pending(TaskState, CFAbsoluteTime)
    case completed
    case failed
  }

  private enum TaskState {
    case unstarted(SFSpeechAudioBufferRecognitionRequest)
    case pending(SFSpeechRecognitionTask)
    case final(SFSpeechRecognitionResult)
  }

  private var state: State = .unstarted
  private let delegate: SpeechTranscriptionRequestDelegate
  private weak var audioEngine: AVAudioEngine?
  private weak var recognizer: SFSpeechRecognizer?

  init(audioEngine: AVAudioEngine, recognizer: SFSpeechRecognizer, delegate: SpeechTranscriptionRequestDelegate) {
    self.audioEngine = audioEngine
    self.delegate = delegate
    self.recognizer = recognizer
  }

  public func startTranscription() -> Result<(), SpeechTranscriptionError> {
    guard let audioEngine = audioEngine else {
      state = .failed
      return .err(.invalidAudioEngine)
    }
    let startTime = CFAbsoluteTimeGetCurrent()
    audioEngine.reset()
    let node = audioEngine.inputNode
    let format = node.outputFormat(forBus: 0)
    let request = SFSpeechAudioBufferRecognitionRequest()
    request.shouldReportPartialResults = true
    node.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
      request.append(buffer)
    }
    audioEngine.prepare()
    do {
      try audioEngine.start()
      state = .pending(.unstarted(request), startTime)
      guard let recognizer = recognizer else {
        state = .failed
        return .err(.invalidSpeechRecognizer)
      }
      let task = recognizer.recognitionTask(with: request, delegate: self)
      state = .pending(.pending(task), startTime)
      return .ok(())
    } catch {
      state = .failed
      return .err(.audioEngineError(error))
    }
  }
}

extension LiveSpeechTranscriptionRequest: SFSpeechRecognitionTaskDelegate {
  func speechRecognitionTask(_ task: SFSpeechRecognitionTask, didFinishSuccessfully success: Bool) {
    Debug.log(format: "Speech recognizer finished task. Success == %@", success ? "true" : "false")
    if success {
      return
    }
    if let error = task.error as NSError? {
      if error.code == 203, error.localizedDescription == "Retry" {
        delegate.speechTranscriptionRequestDidNotDetectSpeech()
        return
      }
      Debug.log(error: error)
    }
    delegate.speechTranscriptionRequestDidTerminate()
  }

  func speechRecognitionTaskWasCancelled(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition task was cancelled.")
  }

  func speechRecognitionTaskFinishedReadingAudio(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition finished reading audio input.")
  }

  func speechRecognitionTask(_ task: SFSpeechRecognitionTask, didFinishRecognition result: SFSpeechRecognitionResult) {
    guard case let .pending(.pending(pendingTask), startTime) = state, pendingTask == task else {
      Debug.log(message: "Invalid state")
      return
    }
    state = .pending(.final(result), startTime)
    let executionTime = CFAbsoluteTimeGetCurrent() - startTime
    delegate.speechTranscriptionRequest(didFinalizeTranscriptionResults: [result], inTime: executionTime)
  }

  func speechRecognitionTask(_ task: SFSpeechRecognitionTask, didHypothesizeTranscription transcription: SFTranscription) {
    guard case let .pending(.pending(pendingTask), _) = state, pendingTask == task else {
      Debug.log(message: "Invalid state")
      return
    }
    delegate.speechTranscriptionRequest(didHypothesizeTranscriptions: [transcription])
  }
}
