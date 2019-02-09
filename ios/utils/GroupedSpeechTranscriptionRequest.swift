import Speech
import AVFoundation

enum SpeechTranscriptionRequestError : Error {
  case invalidAsset
}

class GroupedSpeechTranscriptionRequest {
  let asset: AVAsset
  let assetReader: AVAssetReader
  let assetReaderOutput: AVAssetReaderTrackOutput
  
  init?(forAsset asset: AVAsset) {
    self.asset = asset
    guard case let .ok((assetReader, assetReaderOutput)) = AudioUtil.createAssetReaderAndOutput(withAsset: asset) else {
      return nil
    }
    self.assetReader = assetReader
    self.assetReaderOutput = assetReaderOutput
  }
  
  public func createRequests() -> Result<[SFSpeechAudioBufferRecognitionRequest], SpeechTranscriptionRequestError> {
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
