import Photos

@objc
protocol MediaLibraryManagerDelegate {
  func mediaLibraryManagerDidOutputThumbnail(_ thumbnail: UIImage, forTargetSize size: CGSize)
}

@objc
class MediaLibraryManager: NSObject {
  
  @objc
  public var delegate: MediaLibraryManagerDelegate?
  
  @objc
  public func getVideoAssetsFromLibrary() -> [PHAsset] {
    let fetchOptions = PHFetchOptions()
    let videoAssets = PHAsset.fetchAssets(with: .video, options: fetchOptions)
    var videoAssetArray = Array<PHAsset>()
    for i in 0..<videoAssets.count {
      let videoAsset = videoAssets.object(at: i)
      videoAssetArray.append(videoAsset)
    }
    return videoAssetArray
  }
}
