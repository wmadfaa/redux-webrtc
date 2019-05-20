import { AnyAction, Reducer } from "redux";
import { Media } from "../Definitions";
import * as constants from "../Constants";

export interface MediaState {
  [key: string]: Media;
}

const INITIAL_STATE: MediaState = {};

type MediaReducerType = (state: MediaState, action: AnyAction) => MediaState;

export const addMedia: MediaReducerType = (state, action) => {
  return { ...state, [action.payload.id]: { ...action.payload } };
};

export const removeMediaReducer: MediaReducerType = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.id];
  return result;
};

export const updatedMedia: MediaReducerType = (state, action) => {
  const existing = state[action.payload.id];
  if (!existing) {
    return state;
  }
  return {
    ...state,
    [action.payload.id]: {
      ...existing,
      ...action.payload.updated
    }
  };
};

export const removeCallMedia: MediaReducerType = (state, action) => {
  return Object.keys(state).reduce((acc, id) => {
    const call = state[id];
    if (
      call.source === "remote" &&
      call.roomAddress === action.payload.roomAddress
    ) {
      return { ...acc, [id]: call };
    }
    return { ...acc };
  }, {});
};

const reducer: Reducer = (state: MediaState, action: AnyAction): MediaState => {
  switch (action.type) {
    case constants.ADD_MEDIA:
      return addMedia(state, action);
    case constants.REMOVE_MEDIA:
      return removeMediaReducer(state, action);
    case constants.MEDIA_UPDATED:
      return updatedMedia(state, action);
    case constants.LEAVE_CALL:
      return removeCallMedia(state, action);
    default:
      return INITIAL_STATE;
  }
};

export default reducer;
