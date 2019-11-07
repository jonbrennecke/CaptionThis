import AVFoundation
import UIKit

func renderCapionBackground(
  captionStyle: CaptionStyle,
  layer: CALayer,
  linesByRowKey: [CaptionRowKey: Array<CaptionStringSegmentLine>],
  timestampOfFirstSegment: CFTimeInterval,
  getSizeOfRow: @escaping (CaptionRowKey) -> CGSize
) {
  switch captionStyle.backgroundStyle {
  case let .gradient(backgroundColor, backgroundHeight):
    return renderGradientBackgroundStyle(
      backgroundColor: backgroundColor,
      backgroundHeight: backgroundHeight,
      layer: layer,
      timestampOfFirstSegment: timestampOfFirstSegment
    )
  case let .solid(backgroundColor):
    return renderSolidBackgroundStyle(
      backgroundColor: backgroundColor,
      layer: layer,
      timestampOfFirstSegment: timestampOfFirstSegment
    )
  case let .textBoundingBox(backgroundColor):
    return renderTextBoundingBoxBackgroundStyle(
      captionStyle: captionStyle,
      backgroundColor: backgroundColor,
      layer: layer,
      linesByRowKey: linesByRowKey,
      getSizeOfRow: getSizeOfRow
    )
  case .none:
    return
  }
}

func renderGradientBackgroundStyle(
  backgroundColor: UIColor,
  backgroundHeight: Float,
  layer: CALayer,
  timestampOfFirstSegment: CFTimeInterval
) {
  let backgroundLayer = CALayer()
  backgroundLayer.frame = layer.bounds
  backgroundLayer.masksToBounds = false
  let gradientLayer = createGradientLayer(color: backgroundColor)
  gradientLayer.frame = CGRect(
    origin: .zero,
    size: CGSize(width: layer.bounds.width, height: CGFloat(backgroundHeight))
  )
  backgroundLayer.insertSublayer(gradientLayer, at: 0)
  layer.insertSublayer(backgroundLayer, at: 0)
  layer.masksToBounds = false
  let animation = AnimationUtil.fadeIn(at: min(timestampOfFirstSegment - 0.25, 0))
  backgroundLayer.add(animation, forKey: nil)
}

fileprivate func createGradientLayer(color: UIColor) -> CAGradientLayer {
  let gradientLayer = CAGradientLayer()
  gradientLayer.colors = [
    color.withAlphaComponent(0.8).cgColor,
    color.withAlphaComponent(0).cgColor,
  ]
  gradientLayer.locations = [0, 1]
  gradientLayer.startPoint = CGPoint(x: 0.5, y: 1)
  gradientLayer.endPoint = CGPoint(x: 0.5, y: 0)
  return gradientLayer
}

func renderSolidBackgroundStyle(
  backgroundColor: UIColor,
  layer: CALayer,
  timestampOfFirstSegment: CFTimeInterval
) {
  let backgroundLayer = CALayer()
  backgroundLayer.frame = layer.bounds
  backgroundLayer.opacity = 0
  backgroundLayer.backgroundColor = backgroundColor.withAlphaComponent(0.9).cgColor
  backgroundLayer.masksToBounds = true
  layer.masksToBounds = true
  layer.insertSublayer(backgroundLayer, at: 0)
  let animation = AnimationUtil.fadeIn(at: min(timestampOfFirstSegment - 0.25, 0))
  backgroundLayer.add(animation, forKey: nil)
}

fileprivate struct Padding {
  let vertical: Float
  let horizontal: Float
}

fileprivate let padding = Padding(vertical: 0.75, horizontal: 0.75)

func renderTextBoundingBoxBackgroundStyle(
  captionStyle: CaptionStyle,
  backgroundColor: UIColor,
  layer: CALayer,
  linesByRowKey: [CaptionRowKey: Array<CaptionStringSegmentLine>],
  getSizeOfRow: @escaping (CaptionRowKey) -> CGSize
) {
  let attributes = stringAttributes(for: captionStyle)
  let backgroundLayer = CALayer()
  backgroundLayer.backgroundColor = backgroundColor.cgColor
  let rowBoundingRects = linesByRowKey.flatMap({ key, rowSegments -> [CGRect] in
    let rowSize = getSizeOfRow(key)
    return rowSegments.map {
      let str = string(from: $0)
      let attributedString = NSAttributedString(string: str, attributes: attributes)
      return attributedString.boundingRect(with: rowSize, options: [], context: nil)
    }
  })
  let rowSize = getSizeOfRow(.a)
  let attributedString = NSAttributedString(string: "—", attributes: attributes)
  let emSize = attributedString.boundingRect(with: rowSize, options: [], context: nil).size
  guard
    let widestRect = rowBoundingRects.max(by: { $0.width < $1.width }),
    let tallestRect = rowBoundingRects.max(by: { $0.height < $1.height })
  else {
    return
  }
  let horizontalPadding = CGFloat(padding.horizontal) * emSize.width
  let verticalPadding = CGFloat(padding.vertical) * emSize.height
  let size = CGSize(
    width: widestRect.width + horizontalPadding,
    height: tallestRect.height * 2 + verticalPadding
  )
  let origin = CGPoint(
    x: abs(layer.frame.width - size.width) / 2,
    y: abs(layer.frame.height - size.height) / 2
  )
  let frame = CGRect(origin: origin, size: size)
  backgroundLayer.cornerRadius = 5
  backgroundLayer.frame = frame
  backgroundLayer.masksToBounds = false
  layer.insertSublayer(backgroundLayer, at: 0)
}
