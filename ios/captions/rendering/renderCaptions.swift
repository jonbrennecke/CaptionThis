import Foundation

fileprivate let BAR_SPACE_HEIGHT_FACTOR = CGFloat(1.25)

/**

 TODO: eventually the API should be

 ```
 let render = createRenderer(style, textSegments, layout, duration) // non-changing information
 render(layer, rowLayers)
 ```

 ...in order to prevent recreating much of the same information on each render

 @jonbrennecke 6/5/19

 */
func renderCaptions(
  layer: CALayer,
  rowLayers: CaptionRowLayers,
  style: CaptionStyle,
  textSegments: [CaptionTextSegment],
  duration: CFTimeInterval,
  backgroundHeight: Float
) {
  let rowKeys: [CaptionRowKey] = [.a, .b]
  let rowFrames = getCaptionRowFrames(style: style, layer: layer, rowLayers: rowLayers)
  resizeCaptionRows(effectedRowKeys: rowKeys, rowLayers: rowLayers, rowFrames: rowFrames)
  let rowSizes = getCaptionRowSizes(frames: rowFrames)
  let stringSegmentRows = makeCaptionStringSegmentRows(
    textSegments: textSegments,
    rowSizes: rowSizes,
    style: style,
    keys: rowKeys
  )
  let orderedSegments = makeOrderedCaptionStringSegmentRows(
    rows: stringSegmentRows,
    numberOfRowsToDisplay: rowKeys.count
  )
  let map = CaptionStringsMap.byFitting(
    textSegments: textSegments,
    rowSizes: rowSizes,
    style: style,
    keys: rowKeys
  )
  for timedRows in orderedSegments {
    for (index, stringSegments) in timedRows.data.enumerated() {
      let rowKey = CaptionRowKey.from(index: index)
      let rowLayer = rowLayers.get(byKey: rowKey)
      let positions = CaptionPresetLinePositions(layer: rowLayer, parentLayer: layer)
      let lineStyleLayer = makeFadeInOutLineStyleLayer(
        within: rowLayer.frame,
        positions: positions,
        style: style,
        duration: duration,
        rowKey: rowKey,
        stringSegments: stringSegments,
        map: map,
        timedRows: timedRows
      )
      rowLayer.addSublayer(lineStyleLayer)
    }
  }
  let getSizeOfRow = { (rowKey: CaptionRowKey) -> CGSize in
    rowSizes[rowKey]!
  }
  render(backgroundStyle: style.backgroundStyle)(
    layer, style, backgroundHeight, map, getSizeOfRow
  )
}

fileprivate func getCaptionRowFrames(style: CaptionStyle, layer: CALayer, rowLayers: CaptionRowLayers) -> [CaptionRowKey: CGRect] {
  return [
    .a: getCaptionFrame(byRowKey: .a, style: style, layer: layer, rowLayers: rowLayers),
    .b: getCaptionFrame(byRowKey: .b, style: style, layer: layer, rowLayers: rowLayers),
    .c: getCaptionFrame(byRowKey: .c, style: style, layer: layer, rowLayers: rowLayers),
  ]
}

fileprivate func getCaptionFrame(byRowKey key: CaptionRowKey, style: CaptionStyle, layer: CALayer, rowLayers: CaptionRowLayers) -> CGRect {
  let origin = originForRow(key: key, rowLayers: rowLayers, layer: layer)
  let size = sizeForRow(layer: layer, fontSize: style.font.lineHeight)
  return CGRect(origin: origin, size: size)
}

fileprivate func getCaptionRowSizes(frames: [CaptionRowKey: CGRect]) -> [CaptionRowKey: CGSize] {
  return frames.mapValues { $0.size }
}

fileprivate func resizeCaptionRows(
  effectedRowKeys keys: [CaptionRowKey],
  rowLayers layers: CaptionRowLayers,
  rowFrames frames: [CaptionRowKey: CGRect]
) {
  keys.forEach { key in
    resizeCaptionRow(layer: layers.get(byKey: key), frame: frames[key]!)
  }
}

fileprivate func resizeCaptionRow(layer: CALayer, frame: CGRect) {
  layer.frame = frame
}

fileprivate func sizeForRow(layer: CALayer, fontSize: CGFloat) -> CGSize {
  let width = layer.frame.width
  let height = fontSize
  return CGSize(width: width, height: height)
}

fileprivate func originForRow(key: CaptionRowKey, rowLayers: CaptionRowLayers, layer: CALayer) -> CGPoint {
  switch key {
  case .a:
    let rowLayer = rowLayers.get(byKey: .a)
    return originForTopRow(layer: rowLayer, parentLayer: layer)
  case .b:
    let rowLayer = rowLayers.get(byKey: .b)
    return originForBottomRow(layer: rowLayer, parentLayer: layer)
  default:
    return originForHiddenRow(parentLayer: layer)
  }
}

fileprivate func originForTopRow(layer: CALayer, parentLayer: CALayer) -> CGPoint {
  let inFrameTopY = (parentLayer.frame.height - layer.frame.height - (layer.frame.height * BAR_SPACE_HEIGHT_FACTOR)) / 2
  return CGPoint(x: 0, y: inFrameTopY)
}

fileprivate func originForBottomRow(layer: CALayer, parentLayer: CALayer) -> CGPoint {
  let inFrameBottomY = (parentLayer.frame.height - layer.frame.height + (layer.frame.height * BAR_SPACE_HEIGHT_FACTOR)) / 2
  return CGPoint(x: 0, y: inFrameBottomY)
}

fileprivate func originForHiddenRow(parentLayer: CALayer) -> CGPoint {
  return CGPoint(x: 0, y: parentLayer.frame.height)
}
