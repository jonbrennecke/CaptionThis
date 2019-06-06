import Foundation

class PresentationEffect {
  public typealias EffectCallback = (CALayer) -> Void

  private let doEffectCallback: EffectCallback
  private let undoEffectCallback: EffectCallback

  init(doEffect doEffectCallback: @escaping EffectCallback, undoEffect undoEffectCallback: @escaping EffectCallback) {
    self.doEffectCallback = doEffectCallback
    self.undoEffectCallback = undoEffectCallback
  }

  func doEffect(layer: CALayer) {
    doEffectCallback(layer)
  }

  func undoEffect(layer: CALayer) {
    undoEffectCallback(layer)
  }
}

protocol PresentationEffectFactory: AnyObject {
  associatedtype Args

  func createEffect(args: Args) -> PresentationEffect
}

func composeEffect(_ effects: PresentationEffect...) -> PresentationEffect {
  return PresentationEffect(doEffect: { layer in
    effects.forEach { effect in
      effect.doEffect(layer: layer)
    }
  }, undoEffect: { layer in
    effects.forEach { effect in
      effect.undoEffect(layer: layer)
    }
  })
}
