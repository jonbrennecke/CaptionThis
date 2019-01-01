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
  
  private static let albumTitle = "Caption This"
  
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
  
  public func authorize(_ callback: @escaping (Bool) -> ()) {
    authorizeCaptureDevice() { success in
      guard success else {
        callback(false)
        return
      }
      self.authorizeMicrophone() { success in
        guard success else {
          callback(false)
          return
        }
        self.authorizeMediaLibrary(callback)
      }
    }
  }
  
  private func authorizeCaptureDevice(_ callback: @escaping (Bool) -> ()) {
    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      return callback(true)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video) { granted in
        if granted {
          return callback(true)
        }
        else {
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
  
  private func authorizeMediaLibrary(_ callback: @escaping (Bool) -> ()) {
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
  
  private func authorizeMicrophone(_ callback: @escaping (Bool) -> ()) {
    switch AVCaptureDevice.authorizationStatus(for: .audio) {
    case .authorized:
      return callback(true)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .audio) { granted in
        if granted {
          return callback(true)
        }
        else {
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
  public func startCapture(completionHandler: @escaping (Error?, Bool) -> ()) {
    sessionQueue.async {
      do {
        let outputURL = try self.saveVideoFileOutputOrThrow()
        self.videoFileOutput.stopRecording()
        self.videoFileOutput.startRecording(to: outputURL, recordingDelegate: self)
        completionHandler(nil, true)
      }
      catch let error {
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
    if case .failure = attemptToSetupCameraCaptureSession() {
      Debug.log(message: "Failed to setup camera capture session")
    }
    captureSession.commitConfiguration()
  }
    
  private func attemptToSetupCameraCaptureSession() -> CameraSetupResult {
    captureSession.sessionPreset = .photo
    
    // setup videoCaptureDevice
    videoCaptureDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front)
    guard let videoCaptureDevice = videoCaptureDevice else {
      Debug.log(message: "Built in wide angle camera (front) is not available.")
      return .failure
    }
    
    // setup videoCaptureDeviceInput
    videoCaptureDeviceInput = try? AVCaptureDeviceInput(device: videoCaptureDevice)
    guard let videoCaptureDeviceInput = videoCaptureDeviceInput else {
      Debug.log(message: "Camera capture device could not be used as an input.")
      return .failure
    }
    if (captureSession.canAddInput(videoCaptureDeviceInput)) {
      captureSession.addInput(videoCaptureDeviceInput)
    }
    else {
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
    }
    else {
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
    }
    else {
      Debug.log(message: "Video output could not be added to the capture session.")
      return .failure
    }
    
    // setup videoFileOutput
    if captureSession.canAddOutput(videoFileOutput) {
      captureSession.addOutput(videoFileOutput)
    }
    else {
      Debug.log(message: "Video file output could not be added to the capture session.")
      return .failure
    }
    return .success
  }
  
  @objc
  public func switchToBackCamera() {
    captureSession.beginConfiguration()
    if case .failure = attemptToSwitchToBackCamera() {
      Debug.log(message: "Failed to switch to back camera.")
    }
    captureSession.commitConfiguration()
  }
  
  private func attemptToSwitchToBackCamera() -> CameraSetupResult {
    videoCaptureDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back)
    guard let videoCaptureDevice = videoCaptureDevice else {
      Debug.log(message: "Built in wide angle camera (back) is not available.")
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
    if (captureSession.canAddInput(videoCaptureDeviceInput)) {
      captureSession.addInput(videoCaptureDeviceInput)
    }
    else {
      Debug.log(message: "Camera input could not be added to capture session.")
      return .failure
    }
    return .success
  }
  
  private func createVideoAsset(forURL url: URL, completionHandler: @escaping (Error?, Bool, PHObjectPlaceholder?) -> ()) {
    self.withAlbum() { error, success, album in
      guard let album = album else {
        Debug.log(format: "Failed to find album. Success = %@", success ? "true" : "false")
        completionHandler(nil, false, nil)
        return
      }
      var assetPlaceholder: PHObjectPlaceholder?
      PHPhotoLibrary.shared().performChanges({
        if #available(iOS 9.0, *) {
          let assetRequest = PHAssetCreationRequest.creationRequestForAssetFromVideo(atFileURL: url)
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
        }
        else {
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
        completionHandler(nil, success, assetPlaceholder)
      }
    }
  }
  
  private func withAlbum(_ completionHandler: @escaping (Error?, Bool, PHAssetCollection?) -> ()) {
    let fetchOptions = PHFetchOptions()
    fetchOptions.predicate = NSPredicate(format: "title = %@", CameraManager.albumTitle)
    let collection = PHAssetCollection.fetchAssetCollections(with: .album, subtype: .albumRegular, options: fetchOptions)
    if let album = collection.firstObject {
      completionHandler(nil, true, album)
      return
    }
    var albumPlaceholder: PHObjectPlaceholder?
    PHPhotoLibrary.shared().performChanges({
      let assetCollectionRequest = PHAssetCollectionChangeRequest.creationRequestForAssetCollection(withTitle: CameraManager.albumTitle)
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

extension CameraManager : AVCaptureVideoDataOutputSampleBufferDelegate {
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    guard let delegate = delegate else {
      return
    }
    delegate.cameraManagerDidReceiveCameraDataOutput(videoData: sampleBuffer)
  }
}

extension CameraManager: AVCaptureDataOutputSynchronizerDelegate {
  func dataOutputSynchronizer(_ synchronizer: AVCaptureDataOutputSynchronizer, didOutput synchronizedDataCollection: AVCaptureSynchronizedDataCollection) {
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
  func fileOutput(_ output: AVCaptureFileOutput, didStartRecordingTo fileURL: URL, from connections: [AVCaptureConnection]) {
    Debug.log(format: "Started output to file. URL = %@", fileURL.absoluteString)
    delegate?.cameraManagerDidBeginFileOutput(toFileURL: fileURL)
  }
  
  func fileOutput(_ output: AVCaptureFileOutput, didFinishRecordingTo fileURL: URL, from connections: [AVCaptureConnection], error: Error?) {
    if let error = error {
      Debug.log(error: error)
      return
    }
    createVideoAsset(forURL: fileURL) { error, success, assetPlaceholder in
      Debug.log(format: "Finished output to file. URL = %@", fileURL.absoluteString)
      self.delegate?.cameraManagerDidFinishFileOutput(toFileURL: fileURL, asset: assetPlaceholder, error: error)
    }
  }
}
