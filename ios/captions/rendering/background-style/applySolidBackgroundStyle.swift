import AVFoundation
import UIKit

func applySolidBackgroundStyle(
  layer: CALayer,
  captionStyle: CaptionStyle,
  backgroundHeight _: Float,
  map: CaptionStringsMap,
  getSizeOfRow _: @escaping (CaptionRowKey) -> CGSize
) {
  guard let beginTime = map.getLine(byKey: .a, index: 0)?.timestamp else {
    return
  }
  let backgroundLayer = CALayer()
  backgroundLayer.frame = layer.bounds
  backgroundLayer.opacity = 0
  backgroundLayer.backgroundColor = captionStyle.backgroundColor.withAlphaComponent(0.9).cgColor
  backgroundLayer.masksToBounds = true
  layer.insertSublayer(backgroundLayer, at: 0)
  let animation = AnimationUtil.fadeIn(at: beginTime - 0.25)
  backgroundLayer.add(animation, forKey: nil)
}
