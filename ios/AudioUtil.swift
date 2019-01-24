import AVFoundation

class AudioUtil {
  public static func isCompressed(audioAssetTrack: AVAssetTrack) -> Bool {
    let formatDescriptions = audioAssetTrack.formatDescriptions as! [CMFormatDescription]
    for (_, formatDescription) in formatDescriptions.enumerated() {
      let subType = CMFormatDescriptionGetMediaSubType(formatDescription)
      if subType == kAudioFormatMPEG4AAC {
        return true
      }
    }
    return false
  }
}
