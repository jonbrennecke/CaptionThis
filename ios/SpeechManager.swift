import AVFoundation
import Speech

@objc
protocol SpeechManagerDelegate {
  func speechManagerDidReceiveSpeechTranscription(isFinal: Bool, transcription: SpeechManager.SpeechTranscription)
  func speechManagerDidBecomeAvailable()
  func speechManagerDidBecomeUnavailable()
}

@objc
class SpeechManager: NSObject {
  typealias SpeechTask = SFSpeechAudioBufferRecognitionRequest
  typealias SpeechTranscription = SFTranscription

  private var recognizer: SFSpeechRecognizer
  private var audioEngine: AVAudioEngine
  private static let operationQueue = OperationQueue()
  private static let dispatchQueue = DispatchQueue(label: "Speech recognizer queue")

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

  private func createRecognitionRequestForAudioSessionOrThrow() throws -> SFSpeechAudioBufferRecognitionRequest {
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

  @objc
  public func startCaptureForAsset(_ asset: AVAsset, callback: @escaping (Error?, SFSpeechAudioBufferRecognitionRequest?) -> Void) {
    SpeechManager.dispatchQueue.async {
      do {
        guard let request = try self.createRecognitionRequestForAssetOrThrow(asset) else {
          callback(nil, nil)
          return
        }
        self.startTranscription(withRequest: request)
        callback(nil, request)
      } catch {
        Debug.log(error: error)
        callback(error, nil)
      }
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
    while true {
      guard let sampleBuffer = assetReaderOutput.copyNextSampleBuffer() else {
        break
      }
      request.appendAudioSampleBuffer(sampleBuffer)
    }
    request.endAudio()
    return request
  }

  private func startTranscription(withRequest request: SFSpeechAudioBufferRecognitionRequest) {
    recognizer.recognitionTask(with: request, delegate: self)
  }

  @objc
  public func stopCaptureForAudioSession() {
    guard audioEngine.isRunning else {
      Debug.log(message: "Cannot stop speech recognition capture. Audio engine is not running.")
      return
    }
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
  }

  func speechRecognitionTaskWasCancelled(_: SFSpeechRecognitionTask) {
    Debug.log(message: "Speech recognition task was cancelled.")
  }

  func speechRecognitionTaskFinishedReadingAudio(_: SFSpeechRecognitionTask) {
//    TODO: check task.state
    Debug.log(message: "Speech recognition finished accepting audio input.")
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didFinishRecognition result: SFSpeechRecognitionResult) {
    let transcription = result.bestTranscription
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: true, transcription: transcription)
  }

  func speechRecognitionTask(_: SFSpeechRecognitionTask, didHypothesizeTranscription transcription: SFTranscription) {
    delegate?.speechManagerDidReceiveSpeechTranscription(isFinal: false, transcription: transcription)
  }
}
