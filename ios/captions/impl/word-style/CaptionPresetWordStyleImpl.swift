import Foundation

protocol CaptionPresetWordStyleImpl {
  var wordStyle: CaptionPresetWordStyle { get }
  func applyWordStyle(key: CaptionStyleImpl.LayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, strings: CaptionStringsMap.Value, layout: VideoAnimationLayerLayout, duration: CFTimeInterval)
}
