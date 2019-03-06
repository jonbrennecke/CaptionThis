import Foundation
import UIKit

protocol CaptionPresetWordStyleImpl {
  var wordStyle: CaptionPresetWordStyle { get }
  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment)
}

class CaptionPresetAnimatedWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .animated

  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment) {
    layer.sublayers = nil
    let sublayer = CALayer()
    sublayer.backgroundColor = UIColor.white.cgColor
    let (from: fromBounds, to: toBounds, anchorPoint, position) = bounds(layer: layer, textAlignment: textAlignment)
    sublayer.anchorPoint = anchorPoint
    sublayer.position = position
    let animations = createAnimations(key: key, from: fromBounds, to: toBounds)
    sublayer.add(animations, forKey: "wordStyleAnimation")
    layer.addSublayer(sublayer)
  }

  private func bounds(layer: CALayer, textAlignment: CaptionPresetTextAlignment) -> (from: CGRect, to: CGRect, anchorPoint: CGPoint, position: CGPoint) {
    switch textAlignment {
    case .center:
      let position = CGPoint(x: layer.bounds.width / 2, y: 0)
      let anchorPoint = CGPoint(x: 0.5, y: 0)
      let fromBounds = CGRect(origin: .zero, size: CGSize(width: 0, height: layer.bounds.height))
      let toBounds = CGRect(origin: .zero, size: layer.bounds.size)
      return (from: fromBounds, to: toBounds, anchorPoint: anchorPoint, position: position)
    case .left:
      let fromBounds = CGRect(origin: .zero, size: CGSize(width: 0, height: layer.bounds.height))
      let toBounds = CGRect(origin: .zero, size: layer.bounds.size)
      return (from: fromBounds, to: toBounds, anchorPoint: .zero, position: .zero)
    case .right:
      let position = CGPoint(x: layer.bounds.width, y: 0)
      let anchorPoint = CGPoint(x: 1, y: 0)
      let fromBounds = CGRect(origin: .zero, size: CGSize(width: 0, height: layer.bounds.height))
      let toBounds = CGRect(origin: .zero, size: layer.bounds.size)
      return (from: fromBounds, to: toBounds, anchorPoint: anchorPoint, position: position)
    }
  }

  private func createAnimations(key: CaptionPresetLayerKey, from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
    switch key {
    case .a:
      return createAnimationsForLineA(from: fromBounds, to: toBounds)
    case .b:
      return createAnimationsForLineB(from: fromBounds, to: toBounds)
    case .c:
      return createAnimationsForLineC(from: fromBounds, to: toBounds)
    }
  }

  private func createAnimationsForLineA(from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.animations = AnimationListBuilder()
      .add(steps: [
        BoundsAnimationStep(from: fromBounds, to: toBounds),
      ])
      .add(steps: [])
      .add(steps: [])
      .add(steps: [
        BoundsAnimationStep(from: fromBounds, to: toBounds),
      ])
      .build()
    group.duration = 16
    return group
  }

  private func createAnimationsForLineB(from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.animations = AnimationListBuilder()
      .add(steps: [])
      .add(steps: [
        BoundsAnimationStep(from: fromBounds, to: toBounds),
      ])
      .add(steps: [])
      .add(steps: [])
      .add(steps: [
        BoundsAnimationStep(from: fromBounds, to: toBounds),
      ])
      .build()
    group.duration = 16
    return group
  }

  private func createAnimationsForLineC(from fromBounds: CGRect, to toBounds: CGRect) -> CAAnimationGroup {
    let group = CAAnimationGroup()
    group.repeatCount = .greatestFiniteMagnitude
    group.animations = AnimationListBuilder()
      .add(steps: [])
      .add(steps: [])
      .add(steps: [
        BoundsAnimationStep(from: fromBounds, to: toBounds),
      ])
      .add(steps: [])
      .add(steps: [])
      .add(steps: [
        BoundsAnimationStep(from: fromBounds, to: toBounds),
      ])
      .build()
    group.duration = 16
    return group
  }
}

class CaptionPresetNoWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .none

  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer, textAlignment: CaptionPresetTextAlignment) {
    layer.sublayers = nil
    let sublayer = CALayer()
    sublayer.backgroundColor = UIColor.white.cgColor
    let args = bounds(key: key, layer: layer, textAlignment: textAlignment)
    sublayer.anchorPoint = args.anchorPoint
    sublayer.position = args.position
    sublayer.bounds = args.bounds
    layer.addSublayer(sublayer)
  }

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
