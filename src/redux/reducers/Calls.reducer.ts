import { AnyAction } from "redux";
import { Call } from "../Definitions";
import * as constants from "../Constants";

export interface CallsState {
  [key: string]: Call;
}
const INITIAL_STATE: CallsState = {};

type CallReducerType = (state: CallsState, action: AnyAction) => CallsState;

export const addCall: CallReducerType = (state, action) => {
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

export const updatedCall: CallReducerType = (state, action) => {
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

export const removeCall: CallReducerType = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.roomAddress];
  return result;
};

export default function(state: CallsState, action: AnyAction): CallsState {
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
