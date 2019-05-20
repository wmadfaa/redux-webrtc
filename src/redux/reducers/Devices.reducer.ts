import { Reducer } from "redux";
import { DeviceCapture, DevicePermissionDenied, Devices } from "../actions";
import { DevicePermissions } from "../Definitions";
import * as constants from "../Constants";

export interface DevicesState extends DevicePermissions {
  devices: MediaDeviceInfo[];
}

const INITIAL_STATE: DevicesState = {
  cameraPermissionDenied: false,
  cameraPermissionGranted: false,
  devices: [],
  hasAudioOutput: false,
  hasCamera: false,
  hasMicrophone: false,
  microphonePermissionDenied: false,
  microphonePermissionGranted: false,
  requestingCameraCapture: false,
  requestingCapture: false,
  requestingMicrophoneCapture: false
};

const reducer: Reducer = (
  state: DevicesState,
  action: Devices | DeviceCapture | DevicePermissionDenied
): DevicesState => {
  switch (action.type) {
    case constants.DEVICES:
      const devices = action.payload;
      const audioInputs = devices.filter(
        device => device.kind === "audioinput"
      );
      const videoInputs = devices.filter(
        device => device.kind === "videoinput"
      );
      const audioOutputs = devices.filter(
        device => device.kind === "audiooutput"
      );
      return {
        ...state,
        cameraPermissionGranted:
          videoInputs.filter(device => !!device.label).length > 0,
        devices: videoInputs.filter(device => !!device.label),
        hasAudioOutput: audioOutputs.length > 0,
        hasCamera: videoInputs.length > 0,
        hasMicrophone: audioInputs.length > 0,
        microphonePermissionGranted:
          audioInputs.filter(device => !!device.label).length > 0
      };
    case constants.CAMERA_PERMISSION_DENIED:
      return { ...state, cameraPermissionDenied: true };
    case constants.MICROPHONE_PERMISSION_DENIED:
      return { ...state, microphonePermissionDenied: true };
    case constants.DEVICE_CAPTURE:
      return {
        ...state,
        requestingCameraCapture: action.payload.camera,
        requestingCapture: action.payload.camera || action.payload.microphone,
        requestingMicrophoneCapture: action.payload.microphone
      };
    default:
      return INITIAL_STATE;
  }
};

export default reducer;
