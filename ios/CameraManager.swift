import AVFoundation
import Photos

protocol CameraManagerDelegate {
  func cameraManagerDidReceiveCameraDataOutput(videoData: CMSampleBuffer)
  func cameraManagerDidBeginFileOutput(toFileURL fileURL: URL)
  func cameraManagerDidFinishFileOutput(toFileURL fileURL: URL)
}

@objc
class CameraManager: NSObject {
  
  private var captureSession: AVCaptureSession
  private var videoOutput: AVCaptureVideoDataOutput
  private var photoOutput: AVCapturePhotoOutput
  private var videoFileOutput: AVCaptureMovieFileOutput = AVCaptureMovieFileOutput()
  private var captureDevice: AVCaptureDevice?
  private var captureDeviceInput: AVCaptureDeviceInput?
  private var synchronizer: AVCaptureDataOutputSynchronizer?
  public var delegate: CameraManagerDelegate?
  @objc public var previewLayer: AVCaptureVideoPreviewLayer
  
  override init() {
    captureSession = AVCaptureSession()
    previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
    previewLayer.videoGravity = .resizeAspectFill
    videoOutput = AVCaptureVideoDataOutput()
    photoOutput = AVCapturePhotoOutput()
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
  public func startCapture() {
    saveVideoFileOutput()
  }
  
  @objc
  public func stopCapture() {
    if captureSession.isRunning {
      Debug.log(message: "Stopping camera capture session.")
      videoFileOutput.stopRecording()
      captureSession.stopRunning()
    }
  }
  
  private func saveVideoFileOutput() {
    DispatchQueue.global(qos: .background).async {
      do {
        let outputURL = try FileManager.default
          .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
          .appendingPathComponent("output")
          .appendingPathExtension("mov")
        try? FileManager.default.removeItem(at: outputURL)
        self.videoFileOutput.startRecording(to: outputURL, recordingDelegate: self)
      }
      catch let error {
        Debug.log(error: error)
      }
    }
  }
  
  public func capturePhoto() {
    let settings = AVCapturePhotoSettings()
    settings.isDepthDataDeliveryEnabled = true
    photoOutput.capturePhoto(with: settings, delegate: self)
  }
  
  @objc
  public func setupCameraCaptureSession() {
    guard let captureDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
      Debug.log(message: "Built in wide angle camera is not available.")
      return
    }
    captureSession.beginConfiguration()
    if (captureSession.canAddOutput(videoOutput)) {
      captureSession.addOutput(videoOutput)
    }
    if (captureSession.canAddOutput(photoOutput)) {
      captureSession.addOutput(photoOutput)
    }
    if (captureSession.canAddOutput(videoFileOutput)) {
      captureSession.addOutput(videoFileOutput)
    }
    captureSession.sessionPreset = .photo
    guard let captureDeviceInput = try? AVCaptureDeviceInput(device: captureDevice) else {
      Debug.log(message: "Camera capture device could not be used as an input.")
      return
    }
    guard captureSession.canAddInput(captureDeviceInput) else {
      Debug.log(message: "Camera input could not be added to capture session.")
      return
    }
    if (captureSession.canAddInput(captureDeviceInput)) {
      captureSession.addInput(captureDeviceInput)
    }
    videoOutput.alwaysDiscardsLateVideoFrames = true
    photoOutput.isDepthDataDeliveryEnabled = false
    let queue = DispatchQueue(label: "com.jonbrennecke.VoicePost.camera")
    videoOutput.setSampleBufferDelegate(self, queue: queue)
    if let connection = videoOutput.connection(with: .video) {
      if (connection.isVideoStabilizationSupported) {
        connection.preferredVideoStabilizationMode = .auto
      }
      if (connection.isVideoOrientationSupported) {
        connection.videoOrientation = .portrait
      }
    }
    captureSession.commitConfiguration()
    self.captureDevice = captureDevice
    self.captureDeviceInput = captureDeviceInput
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

extension CameraManager: AVCapturePhotoCaptureDelegate {
  func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
    // TODO
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
    if error == nil {
      UISaveVideoAtPathToSavedPhotosAlbum(fileURL.path, nil, nil, nil)
    }
    Debug.log(format: "Finished output to file. URL = %@", fileURL.absoluteString)
    delegate?.cameraManagerDidFinishFileOutput(toFileURL: fileURL)
  }
}
