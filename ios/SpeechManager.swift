import Speech
import AVFoundation

@objc
protocol SpeechManagerDelegate {
  func speechManagerDidReceiveSpeechTranscription(_ transcription: SpeechManager.SpeechTranscription)
  func speechManagerDidBecomeAvailable()
  func speechManagerDidBecomeUnavailable()
}

@objc
class SpeechManager : NSObject {
  
  typealias SpeechTask = SFSpeechAudioBufferRecognitionRequest
  typealias SpeechTranscription = SFTranscription
  
  private var recognizer: SFSpeechRecognizer
  private var audioEngine: AVAudioEngine
  
  @objc
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
  
  @objc
  public func isAuthorized() -> Bool {
    return recognizer.isAvailable
  }
  
  @objc
  public func isCapturing() -> Bool {
    return audioEngine.isRunning
  }
  
  public func startCaptureForAudioSession(callback: (Error?, SFSpeechAudioBufferRecognitionRequest?) -> ()) {
    do {
      let request = try createRecognitionRequestForAudioSessionOrThrow()
      startTranscription(withRequest: request)
      callback(nil, request)
    }
    catch let error {
      Debug.log(error: error)
      callback(error, nil)
    }
  }
  
  private func createRecognitionRequestForAudioSessionOrThrow() throws -> SFSpeechAudioBufferRecognitionRequest {
    //        TODO use shared audio session
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
    return request
  }
  
  @objc
  public func startCaptureForAsset(_ asset: AVAsset, callback: (Error?, SFSpeechAudioBufferRecognitionRequest?) -> ()) {
    do {
      guard let request = try createRecognitionRequestForAssetOrThrow(asset) else {
        callback(nil, nil)
        return
      }
      startTranscription(withRequest: request)
      callback(nil, request)
    }
    catch let error {
      Debug.log(error: error)
      callback(error, nil)
    }
  }
  
  private func createRecognitionRequestForAssetOrThrow(_ asset: AVAsset) throws -> SFSpeechAudioBufferRecognitionRequest? {
    let assetReader = try AVAssetReader(asset: asset)
    let audioAssetTracks = asset.tracks(withMediaType: .audio)
    guard let audioAssetTrack = audioAssetTracks.first else {
      Debug.log(message: "Failed to create recognition request. No audio track provided.")
      return nil
    }
    let outputSettings = [AVFormatIDKey: kAudioFormatLinearPCM]
    let assetReaderOutput = AVAssetReaderTrackOutput(track: audioAssetTrack, outputSettings: outputSettings)
    assetReader.add(assetReaderOutput)
    let request = SFSpeechAudioBufferRecognitionRequest()
    request.shouldReportPartialResults = true
    assetReader.startReading()
    while (true) {
      guard let sampleBuffer = assetReaderOutput.copyNextSampleBuffer() else {
        break
      }
      request.appendAudioSampleBuffer(sampleBuffer)
    }
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
    recognizer.recognitionTask(with: request) { (result, error) in
      if let error = error {
        Debug.log(error: error)
        return
      }
      guard let transcription = result?.bestTranscription, let delegate = self.delegate else {
        return
      }
      delegate.speechManagerDidReceiveSpeechTranscription(transcription)
    }
  }
}

extension SpeechManager : SFSpeechRecognizerDelegate {
  func speechRecognizer(_ speechRecognizer: SFSpeechRecognizer, availabilityDidChange available: Bool) {
    Debug.log(format: "Speech recognizer availability changed. Available == %@", available)
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
    Debug.log(format: "Speech recognizer finished task. Success == %@", successfully)
  }
}

