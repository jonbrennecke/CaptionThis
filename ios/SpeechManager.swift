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
  private enum State {
    case ready
    case pending(SpeechTranscriptionRequestKind)
  }

  private enum SpeechTranscriptionRequestKind {
    case file(FileSpeechTranscriptionRequest)
  }

  @objc(SpeechTranscription)
  public class SpeechTranscription: NSObject {
    @objc
    public let string: String
    @objc
    public let segments: [SpeechTranscriptionSegment]

    public init(string: String, segments: [SpeechTranscriptionSegment]) {
      self.string = string
      self.segments = segments
    }

    fileprivate convenience init(withTranscription transcription: SFTranscription) {
      let segments = transcription.segments.map { SpeechTranscriptionSegment(withSegment: $0) }
      self.init(string: transcription.formattedString, segments: segments)
    }

    fileprivate convenience init(withTranscriptions transcriptions: [SFTranscription]) {
      let formattedString = transcriptions.reduce(into: "") { acc, t in
        let string = t.formattedString
        let firstChar = String(string.prefix(1)).capitalized
        let rest = String(string.dropFirst())
        acc = firstChar + rest
      }
      let segments = transcriptions.reduce(into: [SpeechTranscriptionSegment]()) { acc, t in
        let segments = t.segments.map { SpeechTranscriptionSegment(withSegment: $0) }
        acc.append(contentsOf: segments)
      }
      self.init(string: formattedString, segments: segments)
    }
  }

  @objc(SpeechTranscriptionSegment)
  public class SpeechTranscriptionSegment: NSObject {
    @objc
    public let duration: TimeInterval
    @objc
    public let timestamp: TimeInterval
    @objc
    public let confidence: Float
    @objc
    public let substring: String

    public init(duration: TimeInterval, timestamp: TimeInterval, confidence: Float, substring: String) {
      self.duration = duration
      self.timestamp = timestamp
      self.confidence = confidence
      self.substring = substring
    }

    fileprivate convenience init(withSegment segment: SFTranscriptionSegment) {
      self.init(duration: segment.duration, timestamp: segment.timestamp, confidence: segment.confidence, substring: segment.substring)
    }
  }

  private var state: State = .ready
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
  public func startCaptureForAsset(_ asset: AVAsset, callback: @escaping (Error?, Bool) -> Void) {
    SpeechManager.operationQueue.addOperation {
      AudioUtil.extractMonoAudio(forAsset: asset) { error, monoAsset in
        if let error = error {
          Debug.log(error: error)
          callback(error, false)
          return
        }
        guard let monoAsset = monoAsset else {
          Debug.log(message: "Failed to create asset with mono audio")
          callback(nil, false)
          return
        }
        guard let request = FileSpeechTranscriptionRequest(forAsset: monoAsset, recognizer: self.recognizer, delegate: self) else {
          Debug.log(message: "Failed to create speech transcription request with asset")
          callback(nil, false)
          return
        }
        switch request.startTranscription() {
        case .ok:
          self.state = .pending(.file(request))
          callback(nil, true)
          break
        case let .err(error):
          callback(error, false)
          break
        }
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

// TODO: delete this
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
    Debug.log(message: "Speech recognition finished reading audio input.")
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didFinishRecognition result: SFSpeechRecognitionResult) {
    let transcription = SpeechTranscription(withTranscription: result.bestTranscription)
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: true, transcription: transcription)
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didHypothesizeTranscription transcription: SFTranscription) {
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: false, transcription: SpeechTranscription(withTranscription: transcription))
  }
}

extension SpeechManager: SpeechTranscriptionRequestDelegate {
  func speechTranscriptionRequestDidNotDetectSpeech() {
    delegate?.speechManagerDidNotDetectSpeech()
  }

  func speechTranscriptionRequestDidTerminate() {
    delegate?.speechManagerDidTerminate()
  }

  func speechTranscriptionRequestDidFinalizeTranscription(results: [SFSpeechRecognitionResult], inTime executionTime: CFAbsoluteTime) {
    Debug.log(format: "Finished speech transcription in %0.2f seconds", executionTime / 60)
    let transcriptions = results.map { $0.bestTranscription }
    let transcription = SpeechTranscription(withTranscriptions: transcriptions)
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: true, transcription: transcription)
    state = .ready
  }
}
