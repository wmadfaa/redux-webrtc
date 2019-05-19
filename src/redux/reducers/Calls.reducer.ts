import * as constants from "../../Constants";

const INITIAL_STATE = {};

export const addCall = (state, action) => {
  return {
    ...state,
    [action.payload.roomAddress]: {
      allowedAudioRoles: ["moderator", "participant"],
      allowedMedia: "video",
      allowedVideoRoles: ["moderator", "participant"],
      joined: false,
      joinedAt: undefined,
      recordable: false,
      recordingState: "offline",
      requestingMedia: undefined,
      roomAddress: action.payload.roomAddress,
      state: "active"
    }
  };
};

export const updatedCall = (state, action) => {
  if (!state[action.payload.roomAddress]) {
    state = addCall(state, action);
  }
  if (action.type === constants.JOIN_CALL) {
    return {
      ...state,
      [action.payload.roomAddress]: {
        ...state[action.payload.roomAddress],
        joined: true,
        joinedAt: new Date(Date.now()),
        requestingMedia: action.payload.desiredMedia
      }
    };
  }
  if (action.type === constants.LEAVE_CALL) {
    return {
      ...state,
      [action.payload.roomAddress]: {
        ...state[action.payload.roomAddress],
        joined: false,
        joinedAt: undefined,
        requestingMedia: undefined
      }
    };
  }
  if (action.type === constants.SET_CALL_PREFERENCE) {
    return {
      ...state,
      [action.payload.roomAddress]: {
        ...state[action.payload.roomAddress],
        requestingMedia: action.payload.desiredMedia
      }
    };
  }
  return state;
};

export const removeCall = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.roomAddress];
  return result;
};

export default function(state, action) {
  switch (action.type) {
    case constants.JOIN_CALL:
      return updatedCall(state, action);
    case constants.LEAVE_CALL:
      return updatedCall(state, action);
    case constants.LEAVE_ROOM:
      return removeCall(state, action);
    case constants.JOIN_ROOM_SUCCESS:
      return updatedCall(state, action);
    case constants.SET_CALL_PREFERENCE:
      return updatedCall(state, action);
    default:
      return INITIAL_STATE;
  }
}
