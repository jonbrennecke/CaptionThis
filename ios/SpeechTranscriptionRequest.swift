import AVFoundation
import Speech

enum SpeechTranscriptionError: Error {
  case invalidAsset
  case invalidAudioEngine
  case invalidSpeechRecognizer
  case audioEngineError(Error)
}

protocol SpeechTranscriptionRequestDelegate {
  func speechTranscriptionRequestDidNotDetectSpeech()
  func speechTranscriptionRequestDidTerminate()
  func speechTranscriptionRequest(didHypothesizeTranscriptions: [SFTranscription])
  func speechTranscriptionRequest(didFinalizeTranscriptionResults: [SFSpeechRecognitionResult], inTime: CFAbsoluteTime)
}
