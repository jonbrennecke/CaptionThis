import UIKit

struct Padding {
  let top: Float
  let bottom: Float
  let left: Float
  let right: Float
}

fileprivate let padding = Padding(top: 7, bottom: 7, left: 12, right: 12)

func applyTextBoundingBoxBackgroundStyle(
  layer: CALayer,
  captionStyle: CaptionStyle,
  backgroundHeight _: Float,
  map: CaptionStringsMap,
  getSizeOfRow: @escaping (CaptionRowKey) -> CGSize
) {
  let backgroundLayer = CALayer()
  backgroundLayer.backgroundColor = captionStyle.backgroundColor.cgColor
  let rowBoundingRects = map.rowData.flatMap({ key, taggedLines -> [CGRect] in
    let rowSize = getSizeOfRow(key)
    return taggedLines.map { $0.string.attributedString.boundingRect(with: rowSize, options: [], context: nil) }
  })
  guard
    let widestRect = rowBoundingRects.max(by: { $0.width < $1.width }),
    let tallestRect = rowBoundingRects.max(by: { $0.height < $1.height })
    else {
      return
  }
  let horizontalPadding = padding.left + padding.right
  let verticalPadding = padding.top + padding.bottom
  let size = CGSize(
    width: widestRect.width + CGFloat(horizontalPadding),
    height: tallestRect.height * 2 + CGFloat(verticalPadding)
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
