import Foundation
import UIKit

protocol CaptionPresetWordStyleImpl {
  var wordStyle: CaptionPresetWordStyle { get }
  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer)
}

class CaptionPresetAnimatedWordStyleImpl: CaptionPresetWordStyleImpl {
  public var wordStyle: CaptionPresetWordStyle = .animated

  func applyWordStyle(key: CaptionPresetLayerKey, layer: CALayer) {
    layer.sublayers = nil
    let sublayer = CALayer()
    sublayer.backgroundColor = UIColor.white.cgColor
    sublayer.position = .zero
    sublayer.anchorPoint = .zero
    let animations = createAnimations(forKey: key, layer: layer)
    sublayer.add(animations, forKey: "wordStyleAnimation")
    layer.addSublayer(sublayer)
  }

  func createAnimations(forKey key: CaptionPresetLayerKey, layer: CALayer) -> CAAnimationGroup {
    switch key {
    case .a:
      return createAnimationsForLineA(layer: layer)
    case .b:
      return createAnimationsForLineB(layer: layer)
    case .c:
      return createAnimationsForLineC(layer: layer)
    }
  }

  func createAnimationsForLineA(layer: CALayer) -> CAAnimationGroup {
    let fromBounds = CGRect(origin: layer.bounds.origin, size: CGSize(width: 0, height: layer.bounds.height))
    let toBounds = CGRect(origin: layer.bounds.origin, size: layer.bounds.size)
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

  func createAnimationsForLineB(layer: CALayer) -> CAAnimationGroup {
    let fromBounds = CGRect(origin: layer.bounds.origin, size: CGSize(width: 0, height: layer.bounds.height))
    let toBounds = CGRect(origin: layer.bounds.origin, size: layer.bounds.size)
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

  func createAnimationsForLineC(layer: CALayer) -> CAAnimationGroup {
    let fromBounds = CGRect(origin: layer.bounds.origin, size: CGSize(width: 0, height: layer.bounds.height))
    let toBounds = CGRect(origin: layer.bounds.origin, size: layer.bounds.size)
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

  func applyWordStyle(key _: CaptionPresetLayerKey, layer: CALayer) {
    layer.backgroundColor = UIColor.white.cgColor
  }
}
