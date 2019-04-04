import Foundation

protocol CaptionPresetWordStyleImpl {
  var wordStyle: CaptionPresetWordStyle { get }
  func applyWordStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, map: CaptionStringsMap, layout: VideoAnimationLayerLayout, duration: CFTimeInterval)
}
