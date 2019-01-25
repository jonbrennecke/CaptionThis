import AVFoundation

class AudioUtil {
  private static let queue = DispatchQueue(label: "audio conversion queue")

  public static func extractMonoAudio(forAsset asset: AVAsset, _ completionHandler: @escaping (Error?, AVAsset?) -> Void) {
    asset.loadValuesAsynchronously(forKeys: ["tracks"]) {
      do {
        let audioAssetTracks = asset.tracks(withMediaType: .audio)
        guard let audioAssetTrack = audioAssetTracks.last else {
          Debug.log(message: "Failed to create mono audio track. No input audio track was provided.")
          completionHandler(nil, nil)
          return
        }
        let outputURL = try FileManager.default
          .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
          .appendingPathComponent("mono_output")
          .appendingPathExtension("mov")
        try? FileManager.default.removeItem(at: outputURL)
        let assetWriter = try AVAssetWriter(outputURL: outputURL, fileType: AVFileType.mov)
        let assetReader = try AVAssetReader(asset: asset)
        var channelLayout = AudioChannelLayout()
        channelLayout.mChannelLayoutTag = kAudioChannelLayoutTag_Mono
        channelLayout.mChannelBitmap = []
        channelLayout.mNumberChannelDescriptions = 0
        let channelLayoutAsData = NSData(bytes: &channelLayout, length: MemoryLayout.size(ofValue: channelLayout))
        let readerSettings: [String: Any] = [
          AVFormatIDKey: kAudioFormatLinearPCM,
          AVChannelLayoutKey: channelLayoutAsData,
          AVNumberOfChannelsKey: 1,
        ]
        let assetReaderOutput = AVAssetReaderTrackOutput(track: audioAssetTrack, outputSettings: readerSettings)
        if assetReader.canAdd(assetReaderOutput) {
          assetReader.add(assetReaderOutput)
        }
        let assetWriterInput = AVAssetWriterInput(mediaType: .audio, outputSettings: nil)
        if assetWriter.canAdd(assetWriterInput) {
          assetWriter.add(assetWriterInput)
        }
        let readerSuccess = assetReader.startReading()
        if !readerSuccess {
          completionHandler(assetWriter.error, nil)
          return
        }
        let writerSuccess = assetWriter.startWriting()
        if !writerSuccess {
          completionHandler(assetWriter.error, nil)
          return
        }
        assetWriter.startSession(atSourceTime: .zero)
        assetWriterInput.requestMediaDataWhenReady(on: queue) {
          while assetWriterInput.isReadyForMoreMediaData {
            if let sampleBuffer = assetReaderOutput.copyNextSampleBuffer() {
              assetWriterInput.append(sampleBuffer)
            } else {
              assetWriterInput.markAsFinished()
              assetReader.cancelReading()
              break
            }
          }
          assetWriterInput.markAsFinished()
          assetWriter.finishWriting {
            let outputAsset = AVURLAsset(url: outputURL)
            completionHandler(nil, outputAsset)
          }
        }
      } catch {
        completionHandler(error, nil)
      }
    }
  }
}
