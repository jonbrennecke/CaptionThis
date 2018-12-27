import Speech

protocol SpeechManagerDelegate {
  func speechManagerDidReceiveSpeechTranscriptionOutput(transcription: SpeechManager.SpeechTranscription)
  func speechManagerDidBecomeAvailable()
  func speechManagerDidBecomeUnavailable()
}

@objc
class SpeechManager : NSObject {
  
  typealias SpeechTask = SFSpeechAudioBufferRecognitionRequest
  typealias SpeechTranscription = SFTranscription
  
  private var recognizer: SFSpeechRecognizer
  private var audioEngine: AVAudioEngine
  
  public var delegate: SpeechManagerDelegate?
  
  override init() {
    recognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))! // FIXME
    audioEngine = AVAudioEngine()
    super.init()
    recognizer.delegate = self
  }
  
  public func authorize(_ callback: @escaping (Bool) -> ()) {
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
  
  public func isAuthorized() -> Bool {
    return recognizer.isAvailable
  }
  
  public func isCapturing() -> Bool {
    return audioEngine.isRunning
  }
  
  public func startCapture(callback: (Error?, SFSpeechAudioBufferRecognitionRequest?) -> ()) {
    do {
      let request = try startCaptureOrThrow()
      callback(nil, request)
    }
    catch let error {
      Debug.log(error: error)
      callback(error, nil)
    }
  }
  
  private func startCaptureOrThrow() throws -> SFSpeechAudioBufferRecognitionRequest {
    //        TODO setup shared audio session
    //        let audioSession = AVAudioSession.sharedInstance()
    //        try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
    //        try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
    let node = audioEngine.inputNode
    let format = node.outputFormat(forBus: 0)
    let request = SFSpeechAudioBufferRecognitionRequest()
    request.shouldReportPartialResults = true
    node.installTap(onBus: 0, bufferSize: 1024, format: format) { (buffer, _) in
      request.append(buffer)
    }
    audioEngine.prepare()
    try audioEngine.start()
    startTranscription(withRequest: request)
    return request
  }
  
  public func stopCapture() {
    guard audioEngine.isRunning else {
      Debug.log(message: "Cannot stop speech recognition capture. Audio engine is not running.")
      return
    }
    audioEngine.stop()
    let node = audioEngine.inputNode
    node.removeTap(onBus: 0)
  }
  
  private func startTranscription(withRequest request: SFSpeechAudioBufferRecognitionRequest) {
    recognizer.recognitionTask(with: request) { (result, _) in
      guard let transcription = result?.bestTranscription, let delegate = self.delegate else {
        return
      }
      delegate.speechManagerDidReceiveSpeechTranscriptionOutput(transcription: transcription)
    }
  }
}

extension SpeechManager : SFSpeechRecognizerDelegate {
  func speechRecognizer(_ speechRecognizer: SFSpeechRecognizer, availabilityDidChange available: Bool) {
    Debug.log(format: "Speech recognizer availability changed. Available == @%", available)
    if available {
      delegate?.speechManagerDidBecomeAvailable()
    }
    else {
      delegate?.speechManagerDidBecomeUnavailable()
    }
  }
}

extension SpeechManager : SFSpeechRecognitionTaskDelegate {
  func speechRecognitionTask(_ task: SFSpeechRecognitionTask, didFinishSuccessfully successfully: Bool) {
    Debug.log(format: "Speech recognizer finished task. Success == @%", successfully)
  }
}

