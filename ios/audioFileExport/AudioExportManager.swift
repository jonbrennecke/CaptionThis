import AVFoundation
import HSCameraUtils
import Photos

@objc(HSAudioExportError)
enum AudioExportError: Int, Error {
  case failedToFindAsset
  case failedToCreateAudioFile
}

@objc(HSAudioExportManager)
class AudioExportManager: NSObject {
  @objc(createAudioFileFromAssetID:completionHandler:)
  static func createAudioFile(
    fromAssetID assetID: String,
    _ completionHandler: @escaping (Error?, URL?) -> Void
  ) -> PHImageRequestID {
    let requestID = loadAVAsset(fromAssetID: assetID) { result in
      switch result {
      case let .success(asset):
        createTemporaryAudioFile(fromAsset: asset) { result in
          switch result {
          case let .success(url):
            completionHandler(nil, url)
          case .failure:
            completionHandler(AudioExportError.failedToCreateAudioFile, nil)
          }
        }
      case let .failure(error):
        completionHandler(error, nil)
      }
    }
    return requestID ?? 0
  }

  fileprivate static func loadAVAsset(
    fromAssetID assetID: String,
    _ completionHandler: @escaping (Result<AVAsset, AudioExportError>) -> Void
  ) -> PHImageRequestID? {
    let options = PHFetchOptions()
    let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: [assetID], options: options)
    guard let phAsset = fetchResult.firstObject else {
      completionHandler(.failure(.failedToFindAsset))
      return nil
    }
    let requestID = PHImageManager.default().requestAVAsset(forVideo: phAsset, options: nil) { asset, _, _ in
      guard let asset = asset else {
        completionHandler(.failure(.failedToFindAsset))
        return
      }
      completionHandler(.success(asset))
    }
    return requestID
  }
}
