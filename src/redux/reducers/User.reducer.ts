import * as constants from "../Constants";

const INITIAL_STATE = {
  displayName: "",
  globalVolumeLimit: 1,
  mediaEnabled: true,
  pushToTalk: false,
  requestingMedia: "video",
  voiceActivityThreshold: -65
};

export const updatePreference = (state, action) => {
  return { ...state, ...action.payload };
};

export default function(state, action) {
  switch (action.type) {
    case constants.SET_USER_PREFERENCE:
      return updatePreference(state, action);
    case constants.RECEIVED_CONFIG:
      return updatePreference(state, {
        payload: {
          displayName:
            action.payload.config.displayName ||
            state.displayName ||
            "Anonymous"
        },
        type: constants.SET_USER_PREFERENCE
      });
    case constants.DEVICES:
      const outputDevice = state.audioOutputDeviceId;
      if (outputDevice) {
        let hasOutputDevice = false;
        Object.keys(state).map(device => {
          if (state[device].id === outputDevice) {
            hasOutputDevice = true;
          }
          if (hasOutputDevice) {
            return state;
          }
        });
      }
      return updatePreference(state, {
        payload: {
          audioOutputDeviceId: ""
        },
        type: constants.SET_USER_PREFERENCE
      });

    default:
      return INITIAL_STATE;
  }
}
