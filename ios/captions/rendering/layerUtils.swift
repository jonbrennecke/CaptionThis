import Foundation

func createSublayerRemover(byName name: String) -> (CALayer) -> Void {
  return { layer in
    removeSublayer(byName: name, parentLayer: layer)
  }
}

func removeSublayer(byName name: String, parentLayer layer: CALayer) {
  guard let sublayer = layer.sublayers?.first(where: { lyr in lyr.name == name }) else {
    return
  }
  sublayer.removeFromSuperlayer()
}

func createAnimationRemover(byKey key: String) -> (CALayer) -> Void {
  return { layer in
    layer.removeAnimation(forKey: key)
  }
}
