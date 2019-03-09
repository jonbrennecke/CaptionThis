import Foundation
import UIKit

protocol CaptionPresetWordStyleImpl {
  var wordStyle: CaptionPresetWordStyle { get }
  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, strings: [NSAttributedString], layout: VideoAnimationLayerLayout, duration: CFTimeInterval)
}

class CaptionPresetAnimatedWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .animated

  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, strings: [NSAttributedString], layout: VideoAnimationLayerLayout, duration: CFTimeInterval) {
    layer.sublayers = nil
    let sublayer = CALayer()
    let bounds = CaptionSizingUtil.layoutForText(originalBounds: layer.bounds, textAlignment: textAlignment)
    sublayer.anchorPoint = bounds.anchorPoint
    sublayer.position = bounds.position
    sublayer.bounds = bounds.toBounds

//    let animations = createAnimations(key: key, from: fromBounds, to: toBounds)
//    sublayer.add(animations, forKey: "wordStyleAnimation")

    // TODO: place in a function
    for (index, string) in strings.enumerated() {
      let textLayer = CATextLayer()
      textLayer.contentsScale = UIScreen.main.scale
      textLayer.allowsFontSubpixelQuantization = true
      textLayer.allowsEdgeAntialiasing = true
      let textSize = string.size()
      let textYOffset = (sublayer.frame.height - textSize.height) / 2
      let textFrame = CGRect(origin: CGPoint(x: 0, y: textYOffset), size: textSize)
      textLayer.frame = textFrame
      textLayer.shadowColor = UIColor.black.cgColor
      textLayer.shadowRadius = 0.5
      textLayer.shadowOpacity = 0.4
      textLayer.shadowOffset = CGSize(width: 0.0, height: CGFloat(layout.shadowOffsetHeight))
      textLayer.string = string
      textLayer.opacity = 0
      let textAnimation = createTextAnimations(key: key, index: index, duration: duration)
      textLayer.add(textAnimation, forKey: "textLayerAnimation")
      sublayer.addSublayer(textLayer)
    }

    layer.addSublayer(sublayer)
  }

  private func createTextAnimations(key: CaptionPresetLayerKey, index: Int, duration: CFTimeInterval) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    let offset = additionalAnimationIndexOffset(key: key)
    let startIndex = 2 * index + offset
    group.animations = CaptionAnimationBuilder()
      .insert(FadeInAnimationStep(), at: startIndex)
      .insert(FadeOutAnimationStep(), at: startIndex + 2)
      .build()
    group.duration = duration
    return group
  }

  private func additionalAnimationIndexOffset(key: CaptionPresetLayerKey) -> Int {
    switch key {
    case .a:
      return 0
    case .b:
      return 1
    case .c:
      return 2
    }
  }

//  private func createAnimations(key: CaptionPresetLayerKey, from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
//    switch key {
//    case .a:
//      return createAnimationsForLineA(from: fromBounds, to: toBounds)
//    case .b:
//      return createAnimationsForLineB(from: fromBounds, to: toBounds)
//    case .c:
//      return createAnimationsForLineC(from: fromBounds, to: toBounds)
//    }
//  }
//
//  private func createAnimationsForLineA(from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
//    let group = CAAnimationGroup()
//    group.repeatCount = .greatestFiniteMagnitude
//    group.animations = CaptionAnimationBuilder()
//      .insert(BoundsAnimationStep(from: fromBounds, to: toBounds), at: 0)
//      .insert(BoundsAnimationStep(from: fromBounds, to: toBounds), at: 3)
//      .build()
//    group.duration = 16 // TODO:
//    return group
//  }
//
//  private func createAnimationsForLineB(from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
//    let group = CAAnimationGroup()
//    group.repeatCount = .greatestFiniteMagnitude
//    group.animations = CaptionAnimationBuilder()
//      .insert(BoundsAnimationStep(from: fromBounds, to: toBounds), at: 1)
//      .insert(BoundsAnimationStep(from: fromBounds, to: toBounds), at: 4)
//      .build()
//    group.duration = 16 // TODO:
//    return group
//  }
//
//  private func createAnimationsForLineC(from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
//    let group = CAAnimationGroup()
//    group.repeatCount = .greatestFiniteMagnitude
//    group.animations = CaptionAnimationBuilder()
//      .insert(BoundsAnimationStep(from: fromBounds, to: toBounds), at: 2)
//      .insert(BoundsAnimationStep(from: fromBounds, to: toBounds), at: 5)
//      .build()
//    group.duration = 16 // TODO:
//    return group
//  }
}

class CaptionPresetNoWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .none

  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment, strings _: [NSAttributedString], layout _: VideoAnimationLayerLayout, duration: CFTimeInterval) {
    layer.sublayers = nil
    let sublayer = CALayer()
    sublayer.backgroundColor = UIColor.white.cgColor
    let args = bounds(key: key, layer: layer, textAlignment: textAlignment)
    sublayer.anchorPoint = args.anchorPoint
    sublayer.position = args.position
    sublayer.bounds = args.bounds
    layer.addSublayer(sublayer)
  }

  // TODO:
  private func bounds(key: CaptionPresetLayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment) -> (bounds: CGRect, anchorPoint: CGPoint, position: CGPoint) {
    if key == .a {
      let bounds = CGRect(origin: .zero, size: CGSize(width: layer.bounds.width, height: layer.bounds.height))
      return (bounds: bounds, anchorPoint: .zero, position: .zero)
    }
    switch textAlignment {
    case .center:
      let position = CGPoint(x: layer.bounds.width / 2, y: 0)
      let anchorPoint = CGPoint(x: 0.5, y: 0)
      let bounds = CGRect(origin: .zero, size: CGSize(width: layer.bounds.width * 0.75, height: layer.bounds.height))
      return (bounds: bounds, anchorPoint: anchorPoint, position: position)
    case .left:
      let bounds = CGRect(origin: .zero, size: CGSize(width: layer.bounds.width * 0.75, height: layer.bounds.height))
      return (bounds: bounds, anchorPoint: .zero, position: .zero)
    case .right:
      let position = CGPoint(x: layer.bounds.width, y: 0)
      let anchorPoint = CGPoint(x: 1, y: 0)
      let bounds = CGRect(origin: .zero, size: CGSize(width: layer.bounds.width * 0.75, height: layer.bounds.height))
      return (bounds: bounds, anchorPoint: anchorPoint, position: position)
    }
  }
}
