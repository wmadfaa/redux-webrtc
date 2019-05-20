import { AnyAction } from "redux";
import { User } from "../Definitions";
import * as constants from "../Constants";

const INITIAL_STATE: User = {
  displayName: "",
  globalVolumeLimit: 1,
  mediaEnabled: true,
  pushToTalk: false,
  requestingMedia: "video",
  voiceActivityThreshold: -65
};

type UserReducerType = (state: User, action: AnyAction) => User;

export const updatePreference: UserReducerType = (state, action) => {
  return { ...state, ...action.payload };
};

export default function(state: User, action: AnyAction) {
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
        action.payload.map(device => {
          if (device.id === outputDevice) {
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
