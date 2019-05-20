import * as constants from "../Constants";

const INITIAL_STATE = {};

export const addMedia = (state, action) => {
  return { ...state, [action.payload.id]: { ...action.payload } };
};

export const removeMediaReducer = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.id];
  return result;
};

export const updatedMedia = (state, action) => {
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

export const removeCallMedia = (state, action) => {
  return Object.keys(state).filter(
    call =>
      !(
        state[call].source === "remote" &&
        state[call].roomAddress === action.payload.roomAddress
      )
  );
};

export default function(state, action) {
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
}
