import { useEffect, ReactNode } from "react";
import { connect } from "react-redux";
import selectors from "../redux/selectors";

export interface DeviceListRenderProps {
  audioInput: boolean;
  audioOutput: boolean;
  cameraPermissionDenied: boolean;
  cameraPermissionGranted: boolean;
  devices: MediaDeviceInfo[];
  hasAudioOutput: boolean;
  hasCamera: boolean;
  hasMicrophone: boolean;
  microphonePermissionDenied: boolean;
  microphonePermissionGranted: boolean;
  requestingCameraCapture?: boolean;
  requestingCapture?: boolean;
  requestingMicrophoneCapture?: boolean;
  videoInput: boolean;
}

export interface IDeviceListProps extends DeviceListRenderProps {
  fetchDevices?: () => void;
  listenForDevices?: () => void;
  render?: (props: DeviceListRenderProps) => ReactNode;
  children?: ReactNode | ((props: DeviceListRenderProps) => ReactNode);
}

const DeviceList = ({
  listenForDevices,
  fetchDevices,
  audioInput,
  audioOutput,
  cameraPermissionDenied,
  cameraPermissionGranted,
  devices,
  hasAudioOutput,
  hasCamera,
  hasMicrophone,
  microphonePermissionDenied,
  microphonePermissionGranted,
  requestingCameraCapture,
  requestingCapture,
  requestingMicrophoneCapture,
  videoInput,
  render,
  children
}: IDeviceListProps): {} | null | undefined => {
  const renderProps = {
    audioInput,
    audioOutput,
    cameraPermissionDenied,
    cameraPermissionGranted,
    devices,
    hasAudioOutput,
    hasCamera,
    hasMicrophone,
    microphonePermissionDenied,
    microphonePermissionGranted,
    requestingCameraCapture,
    requestingCapture,
    requestingMicrophoneCapture,
    videoInput
  };

  useEffect(() => {
    return () => {
      if (listenForDevices instanceof Function) listenForDevices();
      if (fetchDevices instanceof Function) fetchDevices();
    };
  });

  if (render instanceof Function) return render(renderProps);
  if (children instanceof Function) return children(renderProps);
  if (children) return children;
};

const mapStateToProps = (state, props) => {
  const devices = selectors.devices.getDevices(state).filter(function(device) {
    return (
      (!props.audioInput && !props.videoInput && !props.audioOutput) ||
      (device.kind === "audioinput" && props.audioInput) ||
      (device.kind === "videoinput" && props.videoInput) ||
      (device.kind === "audiooutput" && props.audioOutput)
    );
  });
  const permissions = selectors.devices.getDevicePermissions(state);
  return {
    ...props,
    ...permissions,
    devices
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDevices: () => dispatch(Actions.fetchDevices()),
  listenForDevices: () => dispatch(Actions.listenForDevices())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
