import Foundation

@objc
class PermissionsManager: NSObject {
  @objc
  func requestAppPermissions(_ callback: @escaping (Bool) -> Void) {
    AppDelegate.sharedCameraManager.authorize { success in
      guard success else {
        callback(false)
        return
      }
      AppDelegate.sharedSpeechManager.authorize { success in
        guard success else {
          callback(false)
          return
        }
        callback(true)
      }
    }
  }

  @objc
  func arePermissionsGranted() -> Bool {
    let isCameraAuthorized = AppDelegate.sharedCameraManager.isAuthorized()
    let isSpeechAuthorized = AppDelegate.sharedSpeechManager.isAuthorized()
    return isCameraAuthorized && isSpeechAuthorized
  }
}
