import { State } from "../reducers";
import { getMediaTrack } from "./Media.selectors";
import { DevicePermissions } from "../Definitions";

export const getDevices = (
  state: State,
  kind?: MediaDeviceKind
): MediaDeviceInfo[] => {
  const { devices } = state.devices;
  if (!kind) {
    return devices;
  }
  return devices.filter(device => device.kind === kind);
};

export const getDeviceForMediaTrack = (
  state: State,
  id: string
): MediaDeviceInfo | undefined => {
  const { track } = getMediaTrack(state, id);
  const { devices } = state.devices;
  const { deviceId } = track.track.getSettings();
  if (track && track.getSettings) {
    return devices.find(device => device.deviceId === deviceId);
  }
};

export const getDevicePermissions = (state: State): DevicePermissions => {
  const devices = state.devices;
  return {
    cameraPermissionDenied: devices.cameraPermissionDenied,
    cameraPermissionGranted: devices.cameraPermissionGranted,
    hasAudioOutput: devices.hasAudioOutput,
    hasCamera: devices.hasCamera,
    hasMicrophone: devices.hasMicrophone,
    microphonePermissionDenied: devices.microphonePermissionDenied,
    microphonePermissionGranted: devices.microphonePermissionGranted,
    requestingCameraCapture: devices.requestingCameraCapture,
    requestingCapture: devices.requestingCapture,
    requestingMicrophoneCapture: devices.requestingMicrophoneCapture
  };
};

export const getAudioOutputDevice = (state: State): string | undefined =>
  state.user.audioOutputDeviceId;

export const isSupportedBrowser = (): boolean =>
  !!("RTCPeerConnection" in window) && !!("mediaDevices" in navigator);
