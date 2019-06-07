import AVFoundation

func getOppositeCamera(session: AVCaptureSession) -> AVCaptureDevice {
  let position = getOppositeCameraPosition(session: captureSession)
  return AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: position)
}

// NOTE: default to the front camera
fileprivate func getOppositeCameraPosition(session: AVCaptureSession) -> AVCaptureDevice.Position {
  let device = getActiveCaptureDevice(session: session)
  switch device?.position {
  case .some(.back):
    return .front
  case .some(.front):
    return .back
  default:
    return .front
  }
}

fileprivate func getActiveCaptureDevice(session: AVCaptureSession) -> AVCaptureDevice? {
  return session.inputs.reduce(nil) { (device, input) -> AVCaptureDevice? in
    if input.isKind(of: AVCaptureDeviceInput.classForCoder()) {
      let device = (input as! AVCaptureDeviceInput).device
      if isFrontOrBackCamera(device: device) {
        return device
      }
    }
    return device
  }
}

fileprivate func isFrontOrBackCamera(device: AVCaptureDevice) -> Bool {
  return [.back, .front].contains(device.position)
}
