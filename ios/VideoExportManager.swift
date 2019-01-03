import Photos
import AVFoundation

@objc
class VideoExportManager : NSObject {
  @objc
  public func exportVideo(withLocalIdentifier localIdentifier: String,
                          animationParams: VideoAnimationParams,
                          completionHandler: @escaping (Error?, Bool) -> ())
  {
    let options = PHFetchOptions()
    let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: [localIdentifier], options: options)
    guard let photosAsset = fetchResult.firstObject else {
      Debug.log(format: "Could not find PHAsset. Local identifier = %@", localIdentifier)
      completionHandler(nil, false)
      return
    }
    PHImageManager.default().requestAVAsset(forVideo: photosAsset, options: nil) { (asset, _, _) in
      guard let asset = asset else {
        Debug.log(format: "Request for AVAsset failed. Local identifier = %@", localIdentifier)
        completionHandler(nil, false)
        return
      }
      guard let animation = VideoAnimation(withAsset: asset) else {
        completionHandler(nil, false)
        return
      }
      animation.animate(withParams: animationParams)
      animation.exportVideo() { error, success, url in
        if let error = error {
          completionHandler(error, false)
          return
        }
        guard let url = url else {
          completionHandler(nil, false)
          return
        }
        self.createVideoAsset(forURL: url) { (error, success, object) in
          completionHandler(error, success)
        }
      }
    }
  }
  
  private func createVideoAsset(forURL url: URL, _ completionHandler: @escaping (Error?, Bool, PHObjectPlaceholder?) -> ()) {
    self.withAlbum() { error, success, album in
      guard let album = album else {
        Debug.log(format: "Failed to find album. Success = %@", success ? "true" : "false")
        completionHandler(nil, false, nil)
        return
      }
      var assetPlaceholder: PHObjectPlaceholder?
      PHPhotoLibrary.shared().performChanges({
        if #available(iOS 9.0, *) {
          let assetRequest = PHAssetCreationRequest.creationRequestForAssetFromVideo(atFileURL: url)
          guard let placeholder = assetRequest?.placeholderForCreatedAsset else {
            Debug.log(format: "Asset placeholder could not be created. URL = %@", url.path)
            return
          }
          guard let albumChangeRequest = PHAssetCollectionChangeRequest(for: album) else {
            Debug.log(format: "Asset placeholder could not be created. URL = %@", url.path)
            return
          }
          albumChangeRequest.addAssets([placeholder] as NSArray)
          assetPlaceholder = placeholder
        }
        else {
          fatalError("This app only supports iOS 9.0 or above.")
        }
      }) { success, error in
        Debug.log(format: "Finished creating asset for video. Success = %@", success ? "true" : "false")
        if let error = error {
          Debug.log(error: error)
          completionHandler(error, false, nil)
          return
        }
        guard success, let assetPlaceholder = assetPlaceholder else {
          completionHandler(error, success, nil)
          return
        }
        completionHandler(nil, success, assetPlaceholder)
      }
    }
  }
  
  private func withAlbum(_ completionHandler: @escaping (Error?, Bool, PHAssetCollection?) -> ()) {
    let fetchOptions = PHFetchOptions()
    fetchOptions.predicate = NSPredicate(format: "title = %@", PhotosAlbum.albumTitle)
    let collection = PHAssetCollection.fetchAssetCollections(with: .album, subtype: .albumRegular, options: fetchOptions)
    if let album = collection.firstObject {
      completionHandler(nil, true, album)
      return
    }
    var albumPlaceholder: PHObjectPlaceholder?
    PHPhotoLibrary.shared().performChanges({
      let assetCollectionRequest = PHAssetCollectionChangeRequest.creationRequestForAssetCollection(withTitle: PhotosAlbum.albumTitle)
      albumPlaceholder = assetCollectionRequest.placeholderForCreatedAssetCollection
    }) { success, error in
      guard success, let albumPlaceholder = albumPlaceholder else {
        completionHandler(error, success, nil)
        return
      }
      let albumFetchResult = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [albumPlaceholder.localIdentifier], options: nil)
      guard let album = albumFetchResult.firstObject else {
        completionHandler(nil, false, nil)
        return
      }
      completionHandler(nil, true, album)
    }
  }
}
