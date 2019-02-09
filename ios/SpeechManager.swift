import AVFoundation
import Speech

@objc
protocol SpeechManagerDelegate {
  func speechManagerDidReceiveSpeechTranscription(isFinal: Bool, transcription: SpeechManager.SpeechTranscription)
  func speechManagerDidNotDetectSpeech()
  func speechManagerDidTerminate()
  func speechManagerDidBecomeAvailable()
  func speechManagerDidBecomeUnavailable()
}

@objc
class SpeechManager: NSObject {
  typealias SpeechTask = SFSpeechAudioBufferRecognitionRequest
  typealias SpeechTranscription = SFTranscription

  private var recognizer: SFSpeechRecognizer
  private var task: SFSpeechRecognitionTask?
  private var audioEngine: AVAudioEngine
  private static let operationQueue = OperationQueue()

  @objc
  public var delegate: SpeechManagerDelegate?

  override init() {
    recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))! // FIXME:
    recognizer.defaultTaskHint = .dictation
    recognizer.queue = SpeechManager.operationQueue
    audioEngine = AVAudioEngine()
    super.init()
    recognizer.delegate = self
  }

  public func authorize(_ callback: @escaping (Bool) -> Void) {
    SFSpeechRecognizer.requestAuthorization { status in
      switch status {
      case .authorized:
        return callback(true)
      case .notDetermined:
        Debug.log(message: "The authorization status for speech recognition could not be determined.")
        return callback(false)
      case .denied:
        Debug.log(message: "The user has denied access to speech recongnition.")
        return callback(false)
      case .restricted:
        Debug.log(message: "The user can't grant speech recognition access due to restrictions.")
        return callback(false)
      }
    }
  }

  @objc
  public func isAuthorized() -> Bool {
    if case .authorized = SFSpeechRecognizer.authorizationStatus() {
      return true
    }
    return false
  }

  @objc
  public func isCapturing() -> Bool {
    return audioEngine.isRunning
  }

  @objc
  public func isAvailable() -> Bool {
    return recognizer.isAvailable
  }

  @objc
  public func startCaptureForAudioSession(callback: (Error?, SFSpeechAudioBufferRecognitionRequest?) -> Void) {
    do {
      let request = try createRecognitionRequestForAudioSessionOrThrow()
      startTranscription(withRequest: request)
      callback(nil, request)
    } catch {
      Debug.log(error: error)
      callback(error, nil)
    }
  }

  @objc
  public func startCaptureForAsset(_ asset: AVAsset, callback: @escaping (Error?, SFSpeechAudioBufferRecognitionRequest?) -> Void) {
    SpeechManager.operationQueue.addOperation {
      AudioUtil.extractMonoAudio(forAsset: asset) { error, monoAsset in
        if let error = error {
          Debug.log(error: error)
          callback(error, nil)
          return
        }
        guard let monoAsset = monoAsset else {
          callback(nil, nil)
          return
        }
        guard let groupedRequest = GroupedSpeechTranscriptionRequest(forAsset: monoAsset) else {
          callback(nil, nil)
          return
        }
        guard case let .ok(requests) = groupedRequest.createRequests() else {
          Debug.log(message: "Failed to create speech requests")
          callback(nil, nil)
          return
        }
        guard let request = requests.first else {
          Debug.log(message: "Speech requests array should not be empty")
          callback(nil, nil)
          return
        }
        self.startTranscription(withRequest: request)
        callback(nil, request)
      }
    }
  }

  private func createRecognitionRequestForAudioSessionOrThrow() throws -> SFSpeechAudioBufferRecognitionRequest {
    audioEngine.reset()
    let node = audioEngine.inputNode
    let format = node.outputFormat(forBus: 0)
    let request = SFSpeechAudioBufferRecognitionRequest()
    request.shouldReportPartialResults = true
    node.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
      request.append(buffer)
    }
    audioEngine.prepare()
    try audioEngine.start()
    return request
  }

  private func startTranscription(withRequest request: SFSpeechAudioBufferRecognitionRequest) {
    task = recognizer.recognitionTask(with: request, delegate: self)
  }

  @objc
  public func stopCaptureForAudioSession() {
    guard audioEngine.isRunning else {
      Debug.log(message: "Cannot stop speech recognition capture. Audio engine is not running.")
      return
    }
    task?.cancel()
    audioEngine.stop()
    let node = audioEngine.inputNode
    node.removeTap(onBus: 0)
  }
}

extension SpeechManager: SFSpeechRecognizerDelegate {
  func speechRecognizer(_: SFSpeechRecognizer, availabilityDidChange available: Bool) {
    Debug.log(format: "Speech recognizer availability changed. Available == %@", available ? "true" : "false")
    if available {
      delegate?.speechManagerDidBecomeAvailable()
    } else {
      delegate?.speechManagerDidBecomeUnavailable()
    }
  }
}

extension SpeechManager: SFSpeechRecognitionTaskDelegate {
  func speechRecognitionTask(_: SFSpeechRecognitionTask, didFinishSuccessfully success: Bool) {
    Debug.log(format: "Speech recognizer finished task. Success == %@", success ? "true" : "false")
    if success {
      return
    }
    if let error = task?.error as NSError? {
      if error.code == 203, error.localizedDescription == "Retry" {
        delegate?.speechManagerDidNotDetectSpeech()
        return
      }
    }
    delegate?.speechManagerDidTerminate()
  }

  func speechRecognitionTaskWasCancelled(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition task was cancelled.")
  }

  func speechRecognitionTaskFinishedReadingAudio(_: SFSpeechRecognitionTask) {
//    TODO: check task.state
    Debug.log(message: "Speech recognition finished reading audio input.")
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didFinishRecognition result: SFSpeechRecognitionResult) {
    let transcription = result.bestTranscription
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: true, transcription: transcription)
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didHypothesizeTranscription transcription: SFTranscription) {
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: false, transcription: transcription)
  }
}
