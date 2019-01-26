import AVFoundation
import Photos
import UIKit
import CoreGraphics

@objc
class VideoThumbnailView: UIView {
  private let imageView = UIImageView()
  private static let queue = DispatchQueue(label: "thumbnail loading queue")

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
      VideoThumbnailView.queue.async {
        self.loadThumbnail(forAsset: asset, withSize: size)
      }
    }
  }
  
  private func loadThumbnail(forAsset asset: PHAsset, withSize size: CGSize) {
    let requestOptions = PHImageRequestOptions()
    requestOptions.isSynchronous = false
    requestOptions.deliveryMode = .highQualityFormat
    let pixelSize = CGSize(width: asset.pixelWidth, height: asset.pixelHeight)
    let orientation = OrientationUtil.orientation(forSize: pixelSize)
    PHImageManager.default().requestImage(for: asset, targetSize: size, contentMode: .aspectFill, options: requestOptions) { [unowned self] image, _ in
      guard let image = image else {
        return
      }
      self.setBackgroundColor(withImage: image)
      switch orientation {
      case .right, .left:
        self.imageView.contentMode = .scaleAspectFit
        break
      default:
        self.imageView.contentMode = .scaleAspectFill
      }
      self.imageView.image = image
    }
  }
  
  private func setBackgroundColor(withImage image: UIImage) {
    // TODO check orientation (this is only necessary for landscape videos)
    let color = getMostFrequentColor(fromImage: image)
    backgroundColor = color ?? .black
    DispatchQueue.main.async {
      let gradientLayer = CAGradientLayer()
      gradientLayer.frame = self.bounds
      gradientLayer.colors = [
        UIColor.black.withAlphaComponent(0).cgColor,
        UIColor.black.withAlphaComponent(0.5).cgColor
      ]
      gradientLayer.locations = [0, 1]
      self.layer.insertSublayer(gradientLayer, at: 0)
    }
  }
  
  // SEE: https://gist.github.com/Tricertops/6474123
  private func getMostFrequentColor(fromImage image: UIImage) -> UIColor? {
    guard let cgImage = image.cgImage else {
      return nil
    }
    // TODO: use NSCountedSet to put colors in bins instead of creating & sorting array through all colors
    let bitmapData = rgbBitmapData(fromImage: cgImage)
    let colorHistogram = bitmapData.withUnsafeBytes { (bytes: UnsafePointer<UInt8>) -> NSCountedSet in
      let colorHistogram = NSCountedSet(capacity: bitmapData.count / 32)
      for i in stride(from: 0, to: bitmapData.count, by: 4) {
        let color = UIColor(
          red: CGFloat(bytes[i]) / 255,
          green: CGFloat(bytes[i + 1]) / 255,
          blue: CGFloat(bytes[i + 2]) / 255,
          alpha: 1)
        colorHistogram.add(color)
      }
      return colorHistogram
    }
    var sortedColors = colorHistogram.sorted { (a, b) -> Bool in
      return colorHistogram.count(for: a) < colorHistogram.count(for: b)
    }
    // TODO check length
    guard case let color as UIColor = sortedColors[1] else {
      return nil
    }
    return color
  }
  
  private func rgbBitmapData(fromImage image: CGImage) -> Data {
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue)
    let scale: CGFloat = 1
    let size = CGSize(width: CGFloat(image.width) * scale, height: CGFloat(image.height) * scale)
    let bytesPerPixel = 4
    let bitsPerComponent = 8
    let bytesPerRow = bytesPerPixel * Int(size.width)
    var bitmapData = Data(count: Int(size.height * size.width * CGFloat(bytesPerPixel)))
    bitmapData.withUnsafeMutableBytes { (bytes: UnsafeMutablePointer<UInt8>) -> () in
      let context = CGContext(
        data: bytes,
        width: Int(size.width),
        height: Int(size.height),
        bitsPerComponent: bitsPerComponent,
        bytesPerRow: bytesPerRow,
        space: colorSpace,
        bitmapInfo: bitmapInfo.rawValue)
      let rect = CGRect(origin: .zero, size: size)
      context?.draw(image, in: rect)
    }
    return bitmapData
  }
}
