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
  public func requestVideoThumbnails(forTargetSize size: CGSize) {
    let fetchOptions = PHFetchOptions()
    let videoAssets = PHAsset.fetchAssets(with: .video, options: fetchOptions)
    for i in 0..<videoAssets.count {
      let videoAsset = videoAssets.object(at: i)
      PHImageManager.default().requestImage(for: videoAsset, targetSize: size, contentMode: .aspectFill, options: nil) { (image, _) in
        guard let image = image else {
          return
        }
        self.delegate?.mediaLibraryManagerDidOutputThumbnail(image, forTargetSize: size)
      }
    }
  }
}
