import Photos
import UIKit

let SEEKBAR_NUMBER_OF_PREVIEW_FRAMES: UInt = 10

@objc(VideoSeekbarView)
class VideoSeekbarView: UIView {
  private var imageViews: [UIImageView] = []
  private var requestID: PHImageRequestID?

  private static let queue = DispatchQueue(label: "seekbar preview view queue")

  init() {
    super.init(frame: .zero)
    imageViews = [UIImageView]()
    for _ in 0 ..< SEEKBAR_NUMBER_OF_PREVIEW_FRAMES {
      let imageView = UIImageView()
      imageView.layer.masksToBounds = true
      imageViews.append(imageView)
      addSubview(imageView)
    }
  }

  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  deinit {
    if let id = requestID {
      cancelLoadingVideo(requestID: id)
    }
  }

  private func cancelLoadingVideo(requestID: PHImageRequestID) {
    PHImageManager.default().cancelImageRequest(requestID)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    let width = bounds.size.width / CGFloat(imageViews.count)
    let height = bounds.size.height
    for (index, imageView) in imageViews.enumerated() {
      imageView.frame = CGRect(x: width * CGFloat(index), y: 0, width: width, height: height)
    }
  }

  @objc
  public var localIdentifier: String? {
    didSet {
      guard let id = localIdentifier else {
        return
      }
      VideoSeekbarView.queue.async {
        self.loadPreviewImages(withLocalIdentifier: id)
      }
    }
  }

  private func loadPreviewImages(withLocalIdentifier id: String) {
    let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: [id], options: nil)
    guard let asset = fetchResult.firstObject else {
      Debug.log(format: "Failed to fetch PHAsset with id = %@", id)
      return
    }
    let videoRequestOptions = PHVideoRequestOptions()
    videoRequestOptions.deliveryMode = .highQualityFormat
    requestID = PHImageManager.default().requestAVAsset(forVideo: asset, options: videoRequestOptions) { asset, _, _ in
      guard let asset = asset else {
        Debug.log(message: "Failed to generate asset for seekbar preview images")
        return
      }
      VideoSeekbarView.queue.async {
        self.generateImages(withAsset: asset)
      }
    }
  }

  private func generateImages(withAsset asset: AVAsset) {
    let assetImageGenerator = AVAssetImageGenerator(asset: asset)
    assetImageGenerator.appliesPreferredTrackTransform = true
    let duration = CMTimeGetSeconds(asset.duration)
    let step = duration / Double(SEEKBAR_NUMBER_OF_PREVIEW_FRAMES)
    var times = [NSValue]()
    for seconds in stride(from: 0, to: duration, by: step) {
      let time = CMTimeMakeWithSeconds(seconds, preferredTimescale: 600)
      times.append(time as NSValue)
    }
    assetImageGenerator.generateCGImagesAsynchronously(forTimes: times) { requestedTime, cgImage, _, _, error in
      if let error = error {
        Debug.log(error: error)
        return
      }
      guard let cgImage = cgImage else {
        Debug.log(message: "AVAssetImageGenerator completionHandler was called, but no image was generated.")
        return
      }
      let image = UIImage(cgImage: cgImage)
      guard let index = times.firstIndex(of: requestedTime as NSValue) else {
        Debug.log(message: "Failed to find index for requested time.")
        return
      }
      self.set(image: image, atIndex: index)
    }
  }

  private func set(image: UIImage, atIndex index: Int) {
    guard index < imageViews.count else {
      Debug.log(message: "Index is out of bounds")
      return
    }
    let imageView = imageViews[index]
    DispatchQueue.main.async {
      imageView.image = image
      switch image.imageOrientation {
      case .left, .right, .leftMirrored, .rightMirrored:
        imageView.contentMode = .scaleAspectFit
        break
      default:
        imageView.contentMode = .scaleAspectFill
        break
      }
    }
  }
}
