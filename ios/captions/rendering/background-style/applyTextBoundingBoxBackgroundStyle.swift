import UIKit

fileprivate let padding = CGSize(width: 10, height: 10)

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
  let widestRect = rowBoundingRects.max(by: { $0.width < $1.width })
  let tallestRect = rowBoundingRects.max(by: { $0.height < $1.height })
  let size = CGSize(
    width: (widestRect?.width ?? CGFloat(layer.frame.width)) + padding.width,
    height: (((tallestRect?.height) != nil) ? tallestRect!.height * 2 : CGFloat(layer.frame.height)) + padding.height
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
