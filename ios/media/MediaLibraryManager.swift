import Photos

fileprivate let FETCH_LIMIT = 100

@objc
protocol MediaLibraryManagerDelegate {
  func mediaLibraryManagerDidOutputThumbnail(_ thumbnail: UIImage, forTargetSize size: CGSize)
  func mediaLibraryManagerDidUpdateVideos(_ videoAssets: [PHAsset])
}

@objc
class MediaLibraryManager: NSObject {
  @objc
  public var delegate: MediaLibraryManagerDelegate?

  @objc
  public func startObservingVideos() {
    PHPhotoLibrary.shared().register(self)
  }

  @objc
  public func stopObservingVideos() {
    PHPhotoLibrary.shared().unregisterChangeObserver(self)
  }

  @objc
  public func getVideosFromLibrary() -> [PHAsset] {
    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
    fetchOptions.fetchLimit = FETCH_LIMIT
    fetchOptions.wantsIncrementalChangeDetails = true
    let videoAssets = PHAsset.fetchAssets(with: .video, options: fetchOptions)
    var videoAssetArray = Array<PHAsset>()
    for i in 0 ..< videoAssets.count {
      let videoAsset = videoAssets.object(at: i)
      videoAssetArray.append(videoAsset)
    }
    return videoAssetArray
  }
}

extension MediaLibraryManager: PHPhotoLibraryChangeObserver {
  func photoLibraryDidChange(_: PHChange) {
    let assets = getVideosFromLibrary()
    delegate?.mediaLibraryManagerDidUpdateVideos(assets)
  }
}
