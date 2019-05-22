import * as constants from "../Constants";

let deviceListener;

export const listenForDevices = () => {
  return function(dispatch, getState) {
    if (!navigator.mediaDevices) {
      return;
    }
    if (!deviceListener) {
      deviceListener = function() {
        dispatch(fetchDevices());
      };
    }
    deviceListener();
    navigator.mediaDevices.addEventListener("devicechange", deviceListener);
    if (window.safari) {
      devicePollInterval = setInterval(function() {
        if (deviceListener) {
          deviceListener();
        }
      }, 1000);
    }
  };
};
