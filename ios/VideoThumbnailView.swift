import AVFoundation
import CoreGraphics
import Photos
import UIKit

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
      switch orientation {
      case .right, .rightMirrored, .left, .leftMirrored:
        self.imageView.contentMode = .scaleAspectFit
        self.setLandscapeImageBackground(withImage: image)
        break
      default:
        self.imageView.contentMode = .scaleAspectFill
      }
      self.imageView.image = image
    }
  }

  private func setLandscapeImageBackground(withImage image: UIImage) {
    VideoThumbnailView.queue.async {
      let color = self.getMostFrequentColor(fromImage: image)
      let gradientLayer = CAGradientLayer()
      gradientLayer.colors = [
        UIColor.black.withAlphaComponent(0).cgColor,
        UIColor.black.withAlphaComponent(0.5).cgColor,
      ]
      gradientLayer.locations = [0, 1]
      DispatchQueue.main.async {
        gradientLayer.frame = self.bounds
        self.backgroundColor = color ?? .black
        self.layer.insertSublayer(gradientLayer, at: 0)
      }
    }
  }

  // SEE: https://gist.github.com/Tricertops/6474123
  private func getMostFrequentColor(fromImage image: UIImage) -> UIColor? {
    guard let cgImage = image.cgImage else {
      return nil
    }
    let bitmapData = rgbBitmapData(fromImage: cgImage)
    let colorHistogram = bitmapData.withUnsafeBytes { (bytes: UnsafePointer<UInt8>) -> ColorHistogram in
      let colorHistogram = ColorHistogram()
      for i in stride(from: 0, to: bitmapData.count, by: 4) {
        colorHistogram.insertColor(
          red: CGFloat(bytes[i]) / 255,
          green: CGFloat(bytes[i + 1]) / 255,
          blue: CGFloat(bytes[i + 2]) / 255
        )
      }
      return colorHistogram
    }
    let sortedColors = colorHistogram.sortedColors()
    return sortedColors.first
  }

  private func rgbBitmapData(fromImage image: CGImage) -> Data {
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue)
    let scale: CGFloat = 0.25
    let size = CGSize(width: CGFloat(image.width) * scale, height: CGFloat(image.height) * scale)
    let bytesPerPixel = 4
    let bitsPerComponent = 8
    let bytesPerRow = bytesPerPixel * Int(size.width)
    var bitmapData = Data(count: Int(size.height * size.width * CGFloat(bytesPerPixel)))
    bitmapData.withUnsafeMutableBytes { (bytes: UnsafeMutablePointer<UInt8>) -> Void in
      let context = CGContext(
        data: bytes,
        width: Int(size.width),
        height: Int(size.height),
        bitsPerComponent: bitsPerComponent,
        bytesPerRow: bytesPerRow,
        space: colorSpace,
        bitmapInfo: bitmapInfo.rawValue
      )
      let rect = CGRect(origin: .zero, size: size)
      context?.draw(image, in: rect)
    }
    return bitmapData
  }
}

class ColorHistogram {
  private let numberOfBins: Int
  private let countedSet: NSCountedSet

  init(numberOfBins: Int = 100) {
    self.numberOfBins = numberOfBins
    countedSet = NSCountedSet(capacity: numberOfBins * 3)
  }

  public func insertColor(red: CGFloat, green: CGFloat, blue: CGFloat) {
    let color = binnedColor(red: red, green: green, blue: blue)
    countedSet.add(color)
  }

  public func sortedColors() -> [UIColor] {
    return countedSet.sorted { (a, b) -> Bool in
      countedSet.count(for: a) < countedSet.count(for: b)
    } as! [UIColor]
  }

  private func binnedColor(red: CGFloat, green: CGFloat, blue: CGFloat) -> UIColor {
    let numberOfBinsFloat = CGFloat(numberOfBins)
    let r = (red * numberOfBinsFloat).rounded() / numberOfBinsFloat
    let g = (green * numberOfBinsFloat).rounded() / numberOfBinsFloat
    let b = (blue * numberOfBinsFloat).rounded() / numberOfBinsFloat
    return UIColor(
      red: r,
      green: g,
      blue: b,
      alpha: 1
    )
  }
}
