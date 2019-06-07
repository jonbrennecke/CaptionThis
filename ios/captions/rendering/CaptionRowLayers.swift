struct CaptionRowLayers {
  let a = createLayer()
  let b = createLayer()
  let c = createLayer()

  private static func createLayer() -> CALayer {
    let layer = CALayer()
    layer.opacity = 0
    layer.contentsScale = UIScreen.main.scale
    return layer
  }

  public func get(byKey key: CaptionRowKey) -> CALayer {
    switch key {
    case .a:
      return a
    case .b:
      return b
    case .c:
      return c
    }
  }

  public func each(_ callback: (_ key: CaptionRowKey, _ layer: CALayer) -> Void) {
    [CaptionRowKey.a, CaptionRowKey.b, CaptionRowKey.c].forEach { key in
      let layer = get(byKey: key)
      callback(key, layer)
    }
  }
}
