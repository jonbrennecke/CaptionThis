import AVFoundation
import Photos
import UIKit

@objc
class VideoThumbnailView: UIView {
  private let imageView = UIImageView()

  override init(frame: CGRect) {
    super.init(frame: frame)
    imageView.frame = frame
    addSubview(imageView)
  }

  required init?(coder _: NSCoder) {
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
      let pixelSize = CGSize(width: asset.pixelWidth, height: asset.pixelHeight)
      let orientation = OrientationUtil.orientation(forSize: pixelSize)
      PHImageManager.default().requestImage(for: asset, targetSize: size, contentMode: .aspectFill, options: requestOptions) { [unowned self] image, _ in
        guard let image = image else {
          return
        }
        switch orientation {
        case .landscapeRight, .landscapeLeft:
          self.imageView.contentMode = .scaleAspectFit
          break
        default:
          self.imageView.contentMode = .scaleAspectFill
        }
        self.imageView.image = image
      }
    }
  }
}
