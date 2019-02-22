import AVFoundation
import Speech

@objc
protocol SpeechManagerDelegate {
  func speechManagerDidReceiveSpeechTranscription(isFinal: Bool, transcription: SpeechManager.SpeechTranscription)
  func speechManagerDidNotDetectSpeech()
  func speechManagerDidEnd()
  func speechManagerDidFail()
  func speechManagerDidBecomeAvailable()
  func speechManagerDidBecomeUnavailable()
  func speechManagerDidChangeLocale(_ locale: Locale)
}

@objc
class SpeechManager: NSObject {
  private enum State {
    case ready
    case pending(SpeechTranscriptionRequestKind)
  }

  private enum SpeechTranscriptionRequestKind {
    case file(FileSpeechTranscriptionRequest)
    case live(LiveSpeechTranscriptionRequest)
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
        let lastSegment = acc.last
        let lastTimestamp = lastSegment?.timestamp ?? 0
        let lastDuration = lastSegment?.duration ?? 0
        let lastSegmentEndTimestamp = lastTimestamp + lastDuration
        let segments = t.segments.map {
          SpeechTranscriptionSegment(
            duration: $0.duration,
            timestamp: $0.timestamp + lastSegmentEndTimestamp,
            confidence: $0.confidence,
            substring: $0.substring
          )
        }
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

  @objc
  public var locale: Locale {
    return recognizer.locale
  }

  @objc(setLocale:)
  public func set(locale: Locale) -> Bool {
    guard case .ready = state else {
      Debug.log(message: "Cannot change speech recognizer locale while recognizer is running")
      return false
    }
    let recognizer = SpeechManager.createSpeechRecognizer(locale: locale)
    self.recognizer = recognizer
    Debug.log(format: "Changed speech recognizer locale to %@", locale.identifier)
    delegate?.speechManagerDidChangeLocale(locale)
    return true
  }

  override init() {
    recognizer = SpeechManager.createSpeechRecognizer(locale: Locale.current)
    audioEngine = AVAudioEngine()
    super.init()
    recognizer.delegate = self
  }

  private static func createSpeechRecognizer(locale _: Locale) -> SFSpeechRecognizer {
    let recognizer = SFSpeechRecognizer(locale: Locale.current) ?? SFSpeechRecognizer(locale: Locale(identifier: "en-US"))!
    recognizer.defaultTaskHint = .dictation
    recognizer.queue = SpeechManager.operationQueue
    return recognizer
  }

  @objc
  public func supportedLocales() -> Set<Locale> {
    return SFSpeechRecognizer.supportedLocales()
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
  public func startCaptureForAudioSession(callback: @escaping (Error?, Bool) -> Void) {
    SpeechManager.operationQueue.addOperation {
      let request = LiveSpeechTranscriptionRequest(audioEngine: self.audioEngine, recognizer: self.recognizer, delegate: self)
      switch request.startTranscription() {
      case .ok:
        self.state = .pending(.live(request))
        callback(nil, true)
        break
      case let .err(error):
        callback(error, false)
        break
      }
    }
  }

  @objc
  public func startCapture(forAsset asset: AVAsset, callback: @escaping (Error?, Bool) -> Void) {
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

  @objc
  public func stopCaptureForAudioSession() {
    guard case let .pending(.live(request)) = state else {
      Debug.log(message: "Failed to stop capture. Invalid state.")
      return
    }
    if case let .err(error) = request.stopTranscription() {
      Debug.log(error: error)
    }
  }
}

extension SpeechManager: SFSpeechRecognizerDelegate {
  func speechRecognizer(_: SFSpeechRecognizer, availabilityDidChange available: Bool) {
    Debug.log(format: "Speech recognizer availability changed. Available == %@", available ? "true" : "false")
    if available {
      delegate?.speechManagerDidChangeLocale(locale)
      delegate?.speechManagerDidBecomeAvailable()
    } else {
      delegate?.speechManagerDidBecomeUnavailable()
    }
  }
}

extension SpeechManager: SpeechTranscriptionRequestDelegate {
  func speechTranscriptionRequestDidNotDetectSpeech() {
    delegate?.speechManagerDidNotDetectSpeech()
  }

  func speechTranscriptionRequestDidEnd() {
    delegate?.speechManagerDidEnd()
  }

  func speechTranscriptionRequestDidFail() {
    delegate?.speechManagerDidFail()
  }

  func speechTranscriptionRequest(didFinalizeTranscriptionResults results: [SFSpeechRecognitionResult], inTime executionTime: CFAbsoluteTime) {
    Debug.log(format: "Finished speech transcription in %0.2f seconds", executionTime / 60)
    let transcriptions = results.map { $0.bestTranscription }
    let transcription = SpeechTranscription(withTranscriptions: transcriptions)
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: true, transcription: transcription)
    state = .ready
  }

  func speechTranscriptionRequest(didHypothesizeTranscriptions transcriptions: [SFTranscription]) {
    let transcription = SpeechTranscription(withTranscriptions: transcriptions)
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: false, transcription: transcription)
  }
}
