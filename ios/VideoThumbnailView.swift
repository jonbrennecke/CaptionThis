import AVFoundation
import Photos
import UIKit

@objc
class VideoThumbnailView: UIView {
  
  private let imageView = UIImageView()
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    imageView.frame = frame
    imageView.contentMode = .scaleAspectFill
    addSubview(imageView)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init?(coder: NSCoder) is not implemented.")
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    imageView.frame = frame
  }

  @objc
  public var asset: PHAsset? {
    didSet {
      guard let asset = self.asset else {
        return
      }
      let size = frame.size.equalTo(.zero) ? CGSize(width: 100, height: 100 * 4 / 3) : frame.size
      let requestOptions = PHImageRequestOptions()
      requestOptions.isSynchronous = false
      requestOptions.deliveryMode = .highQualityFormat
      PHImageManager.default().requestImage(for: asset, targetSize: size, contentMode: .aspectFill, options: requestOptions) { [unowned self] image, _ in
        self.imageView.image = image;
      }
    }
  }
}
