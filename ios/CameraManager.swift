import AVFoundation
import Photos

@objc
protocol CameraManagerDelegate {
  func cameraManagerDidReceiveCameraDataOutput(videoData: CMSampleBuffer)
  func cameraManagerDidBeginFileOutput(toFileURL fileURL: URL)
  func cameraManagerDidFinishFileOutput(toFileURL fileURL: URL, asset: PHObjectPlaceholder?, error: Error?)
}

fileprivate enum CameraSetupResult {
  case success
  case failure
}

@objc
class CameraManager: NSObject {
  private var captureSession: AVCaptureSession
  private var videoOutput: AVCaptureVideoDataOutput
  private var videoFileOutput: AVCaptureMovieFileOutput = AVCaptureMovieFileOutput()
  private var videoCaptureDevice: AVCaptureDevice?
  private var videoCaptureDeviceInput: AVCaptureDeviceInput?
  private var audioCaptureDevice: AVCaptureDevice?
  private var audioCaptureDeviceInput: AVCaptureDeviceInput?
  private var synchronizer: AVCaptureDataOutputSynchronizer?
  private let sessionQueue = DispatchQueue(label: "session queue")

  @objc
  public var delegate: CameraManagerDelegate?

  @objc
  public var previewLayer: AVCaptureVideoPreviewLayer

  override init() {
    captureSession = AVCaptureSession()
    previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
    previewLayer.videoGravity = .resizeAspectFill
    videoOutput = AVCaptureVideoDataOutput()
    super.init()
  }

  public func authorize(_ callback: @escaping (Bool) -> Void) {
    authorizeCaptureDevice { success in
      guard success else {
        callback(false)
        return
      }
      self.authorizeMicrophone { success in
        guard success else {
          callback(false)
          return
        }
        self.authorizeMediaLibrary(callback)
      }
    }
  }

  private func authorizeCaptureDevice(_ callback: @escaping (Bool) -> Void) {
    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      return callback(true)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video) { granted in
        if granted {
          return callback(true)
        } else {
          return callback(false)
        }
      }
    case .denied:
      Debug.log(message: "The user has denied access to the camera.")
      return callback(false)
    case .restricted:
      Debug.log(message: "The user can't grant camera access due to restrictions.")
      return callback(false)
    }
  }

  private func authorizeMediaLibrary(_ callback: @escaping (Bool) -> Void) {
    PHPhotoLibrary.requestAuthorization { status in
      switch status {
      case .authorized:
        return callback(true)
      case .denied:
        Debug.log(message: "The user has denied access to the media library.")
        return callback(false)
      case .notDetermined:
        Debug.log(message: "The authorization to the media library could not be determined.")
        return callback(false)
      case .restricted:
        Debug.log(message: "The user can't grant access to the media library due to restrictions.")
        return callback(false)
      }
    }
  }

  private func authorizeMicrophone(_ callback: @escaping (Bool) -> Void) {
    switch AVCaptureDevice.authorizationStatus(for: .audio) {
    case .authorized:
      return callback(true)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .audio) { granted in
        if granted {
          return callback(true)
        } else {
          return callback(false)
        }
      }
    case .denied:
      Debug.log(message: "The user has denied access to the microphone.")
      return callback(false)
    case .restricted:
      Debug.log(message: "The user can't grant microphone access due to restrictions.")
      return callback(false)
    }
  }

  public func isAuthorized() -> Bool {
    if case .authorized = AVCaptureDevice.authorizationStatus(for: .video),
      case .authorized = AVCaptureDevice.authorizationStatus(for: .audio) {
      return true
    }
    return false
  }

  @objc
  public func startPreview() {
    if case .authorized = AVCaptureDevice.authorizationStatus(for: .video) {
      guard captureSession.isRunning else {
        Debug.log(message: "Starting camera capture session.")
        captureSession.startRunning()
        return
      }
      Debug.log(message: "Cannot start camera capture, camera is already running.")
      return
    }
    Debug.log(message: "Cannot start camera capture, camera use has not been authorized.")
  }

  @objc
  public func startCapture(completionHandler: @escaping (Error?, Bool) -> Void) {
    sessionQueue.async {
      guard self.videoCaptureDevice != nil else {
        Debug.log(message: "Cannot start capture. No video capture device is set.")
        completionHandler(nil, false)
        return
      }
      do {
        let outputURL = try self.saveVideoFileOutputOrThrow()
        self.videoFileOutput.stopRecording()
        self.videoFileOutput.startRecording(to: outputURL, recordingDelegate: self)
        completionHandler(nil, true)
      } catch {
        completionHandler(error, false)
      }
    }
  }

  @objc
  public func stopCapture() {
    if videoFileOutput.isRecording {
      Debug.log(message: "Stopping video file output.")
      videoFileOutput.stopRecording()
    }
  }

  @objc
  public func stopPreview() {
    if captureSession.isRunning {
      Debug.log(message: "Stopping camera capture session.")
      captureSession.stopRunning()
    }
  }

  private func saveVideoFileOutputOrThrow() throws -> URL {
    let outputURL = try FileManager.default
      .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
      .appendingPathComponent("output")
      .appendingPathExtension("mov")
    try? FileManager.default.removeItem(at: outputURL)
    return outputURL
  }

  @objc
  public func setupCameraCaptureSession() {
    captureSession.beginConfiguration()
    NotificationCenter.default.addObserver(self, selector: #selector(captureSessionRuntimeError), name: .AVCaptureSessionRuntimeError, object: captureSession)
    if case .failure = attemptToSetupCameraCaptureSession() {
      Debug.log(message: "Failed to setup camera capture session")
    }
    captureSession.commitConfiguration()
  }

  @objc
  private func captureSessionRuntimeError(error: Error) {
    Debug.log(error: error)
  }

  private func attemptToSetupCameraCaptureSession() -> CameraSetupResult {
    captureSession.sessionPreset = .high

    // setup videoCaptureDevice
    videoCaptureDevice = captureDevice(withPosition: .front)
    guard let videoCaptureDevice = videoCaptureDevice else {
      Debug.log(message: "Built in wide angle camera (front) is not available.")
      return .failure
    }
    if videoCaptureDevice.isFocusModeSupported(.autoFocus) {
      videoCaptureDevice.focusMode = .autoFocus
    }

    // setup videoCaptureDeviceInput
    videoCaptureDeviceInput = try? AVCaptureDeviceInput(device: videoCaptureDevice)
    guard let videoCaptureDeviceInput = videoCaptureDeviceInput else {
      Debug.log(message: "Camera capture device could not be used as an input.")
      return .failure
    }
    if captureSession.canAddInput(videoCaptureDeviceInput) {
      captureSession.addInput(videoCaptureDeviceInput)
    } else {
      Debug.log(message: "Camera input could not be added to capture session.")
      return .failure
    }

    // setup audioCaptureDevice
    audioCaptureDevice = AVCaptureDevice.default(for: .audio)
    guard let audioCaptureDevice = audioCaptureDevice else {
      Debug.log(message: "Audio device is not available.")
      return .failure
    }

    // setup audioCaptureDeviceInput
    audioCaptureDeviceInput = try? AVCaptureDeviceInput(device: audioCaptureDevice)
    guard let audioCaptureDeviceInput = audioCaptureDeviceInput else {
      Debug.log(message: "Audio device could not be used as an input.")
      return .failure
    }
    if captureSession.canAddInput(audioCaptureDeviceInput) {
      captureSession.addInput(audioCaptureDeviceInput)
    } else {
      Debug.log(message: "Audio input could not be added to the capture session.")
      return .failure
    }

    // setup videoOutput
    videoOutput.alwaysDiscardsLateVideoFrames = true
    videoOutput.setSampleBufferDelegate(self, queue: sessionQueue)
    if captureSession.canAddOutput(videoOutput) {
      captureSession.addOutput(videoOutput)
      if let connection = videoOutput.connection(with: .video) {
        if connection.isVideoStabilizationSupported {
          connection.preferredVideoStabilizationMode = .auto
        }
        if connection.isVideoOrientationSupported {
          connection.videoOrientation = .portrait
        }
      }
    } else {
      Debug.log(message: "Video output could not be added to the capture session.")
      return .failure
    }

    // setup videoFileOutput
    if captureSession.canAddOutput(videoFileOutput) {
      captureSession.addOutput(videoFileOutput)
    } else {
      Debug.log(message: "Video file output could not be added to the capture session.")
      return .failure
    }
    return .success
  }

  private func captureDevice(withPosition position: AVCaptureDevice.Position) -> AVCaptureDevice? {
    if let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: position) {
      return device
    }
    let discoverySession = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInWideAngleCamera], mediaType: .video, position: position)
    return discoverySession.devices.first
  }

  @objc
  public func switchToOppositeCamera() {
    captureSession.beginConfiguration()
    if case .failure = attemptToSwitchToOppositeCamera() {
      Debug.log(message: "Failed to switch to opposite camera.")
    }
    captureSession.commitConfiguration()
  }

  private func getOppositeCameraPosition() -> AVCaptureDevice.Position {
    switch videoCaptureDevice?.position {
    case .some(.back):
      return .front
    case .some(.front):
      return .back
    default:
      return .front // default to front camera
    }
  }

  private func attemptToSwitchToOppositeCamera() -> CameraSetupResult {
    let cameraPosition = getOppositeCameraPosition()
    videoCaptureDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: cameraPosition)
    guard let videoCaptureDevice = videoCaptureDevice else {
      Debug.log(format: "Built in wide angle camera is not available. Position = %@", cameraPosition == .back ? "back" : "front")
      return .failure
    }
    if let videoCaptureDeviceInput = videoCaptureDeviceInput {
      captureSession.removeInput(videoCaptureDeviceInput)
    }
    videoCaptureDeviceInput = try? AVCaptureDeviceInput(device: videoCaptureDevice)
    guard let videoCaptureDeviceInput = videoCaptureDeviceInput else {
      Debug.log(message: "Camera capture device could not be used as an input.")
      return .failure
    }
    if captureSession.canAddInput(videoCaptureDeviceInput) {
      captureSession.addInput(videoCaptureDeviceInput)
    } else {
      Debug.log(message: "Camera input could not be added to capture session.")
      return .failure
    }
    return .success
  }

  @objc
  public func focusOnPoint(_ focusPointInLayerCoords: CGPoint) {
    Debug.log(format: "Setting focus to %0.2f, %0.2f", focusPointInLayerCoords.x, focusPointInLayerCoords.y)
    guard let device = videoCaptureDevice else {
      return
    }
    let focusPointInDeviceCoords = previewLayer.captureDevicePointConverted(fromLayerPoint: focusPointInLayerCoords)
    do {
      try device.lockForConfiguration()
      if device.isFocusModeSupported(.autoFocus) {
        device.focusMode = .autoFocus
      }
      if device.isFocusPointOfInterestSupported {
        device.focusPointOfInterest = focusPointInDeviceCoords
      }
      if device.isExposureModeSupported(.continuousAutoExposure) {
        device.exposureMode = .continuousAutoExposure
      }
      if device.isExposurePointOfInterestSupported {
        device.exposurePointOfInterest = focusPointInDeviceCoords
      }
      device.unlockForConfiguration()
    } catch {
      Debug.log(error: error)
    }
  }

  public func createVideoAsset(forURL url: URL, completionHandler: @escaping (Error?, Bool, PHObjectPlaceholder?) -> Void) {
    withAlbum { error, success, album in
      guard let album = album else {
        Debug.log(format: "Failed to find album. Success = %@", success ? "true" : "false")
        completionHandler(nil, false, nil)
        return
      }
      var assetPlaceholder: PHObjectPlaceholder?
      PHPhotoLibrary.shared().performChanges({
        if #available(iOS 9.0, *) {
          let assetRequest = PHAssetCreationRequest.creationRequestForAssetFromVideo(atFileURL: url)
          // TODO: eventually there should be a user-enabled option to save recorded videos in the library
          assetRequest?.isHidden = true
          guard let placeholder = assetRequest?.placeholderForCreatedAsset else {
            Debug.log(format: "Asset placeholder could not be created. URL = %@", url.path)
            return
          }
          guard let albumChangeRequest = PHAssetCollectionChangeRequest(for: album) else {
            Debug.log(format: "Asset placeholder could not be created. URL = %@", url.path)
            return
          }
          albumChangeRequest.addAssets([placeholder] as NSArray)
          assetPlaceholder = placeholder
        } else {
          fatalError("This app only supports iOS 9.0 or above.")
        }
      }) { success, error in
        Debug.log(format: "Finished creating asset for video. Success = %@", success ? "true" : "false")
        if let error = error {
          Debug.log(error: error)
          completionHandler(error, false, nil)
          return
        }
        guard success, let assetPlaceholder = assetPlaceholder else {
          completionHandler(error, success, nil)
          return
        }
        PHAsset.fetchAssets(withLocalIdentifiers: [assetPlaceholder.localIdentifier], options: nil)
        completionHandler(nil, success, assetPlaceholder)
      }
    }
  }

  public func withAlbum(_ completionHandler: @escaping (Error?, Bool, PHAssetCollection?) -> Void) {
    let fetchOptions = PHFetchOptions()
    fetchOptions.predicate = NSPredicate(format: "title = %@", PhotosAlbum.albumTitle)
    let collection = PHAssetCollection.fetchAssetCollections(with: .album, subtype: .albumRegular, options: fetchOptions)
    if let album = collection.firstObject {
      completionHandler(nil, true, album)
      return
    }
    var albumPlaceholder: PHObjectPlaceholder?
    PHPhotoLibrary.shared().performChanges({
      let assetCollectionRequest = PHAssetCollectionChangeRequest.creationRequestForAssetCollection(withTitle: PhotosAlbum.albumTitle)
      albumPlaceholder = assetCollectionRequest.placeholderForCreatedAssetCollection
    }) { success, error in
      guard success, let albumPlaceholder = albumPlaceholder else {
        completionHandler(error, success, nil)
        return
      }
      let albumFetchResult = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [albumPlaceholder.localIdentifier], options: nil)
      guard let album = albumFetchResult.firstObject else {
        completionHandler(nil, false, nil)
        return
      }
      completionHandler(nil, true, album)
    }
  }
}

extension CameraManager: AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(_: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from _: AVCaptureConnection) {
    guard let delegate = delegate else {
      return
    }
    delegate.cameraManagerDidReceiveCameraDataOutput(videoData: sampleBuffer)
  }
}

extension CameraManager: AVCaptureDataOutputSynchronizerDelegate {
  func dataOutputSynchronizer(_: AVCaptureDataOutputSynchronizer, didOutput synchronizedDataCollection: AVCaptureSynchronizedDataCollection) {
    guard
      let delegate = delegate,
      let videoData = synchronizedDataCollection.synchronizedData(for: videoOutput) as? AVCaptureSynchronizedSampleBufferData
    else {
      return
    }
    delegate.cameraManagerDidReceiveCameraDataOutput(videoData: videoData.sampleBuffer)
  }
}

extension CameraManager: AVCaptureFileOutputRecordingDelegate {
  func fileOutput(_: AVCaptureFileOutput, didStartRecordingTo fileURL: URL, from _: [AVCaptureConnection]) {
    Debug.log(format: "Started output to file. URL = %@", fileURL.absoluteString)
    delegate?.cameraManagerDidBeginFileOutput(toFileURL: fileURL)
  }

  func fileOutput(_: AVCaptureFileOutput, didFinishRecordingTo fileURL: URL, from _: [AVCaptureConnection], error: Error?) {
    if let error = error {
      Debug.log(error: error)
      return
    }
    createVideoAsset(forURL: fileURL) { error, _, assetPlaceholder in
      Debug.log(format: "Finished output to file. URL = %@", fileURL.absoluteString)
      self.delegate?.cameraManagerDidFinishFileOutput(toFileURL: fileURL, asset: assetPlaceholder, error: error)
    }
  }
}
