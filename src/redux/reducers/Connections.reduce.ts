import * as constants from "../Constants";

const INITIAL_STATE = {};

export const addConnection = (state, action) => {
  return {
    ...state,
    [action.payload.id]: {
      connectionState: "",
      id: action.payload.id,
      peerAddress: action.payload.peerAddress,
      receivingAudioMediaId: "",
      receivingVideoMediaId: "",
      sendingAudioMediaId: "",
      sendingVideoMediaId: ""
    }
  };
};

export const updateConnection = (state, action) => {
  if (!state[action.payload.id]) {
    return state;
  }
  return {
    ...state,
    [action.payload.id]: {
      ...(state[action.payload.id] || {}),
      peerAddress: action.payload.peerAddress,
      ...state.action.payload.updated
    }
  };
};

export const removeConnection = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.id];
  return result;
};

export default function(state, action) {
  switch (action.type) {
    case constants.PEER_CONNECTION_ADDED:
      return addConnection(state, action);
    case constants.PEER_CONNECTION_UPDATED:
      return updateConnection(state, action);
    case constants.PEER_CONNECTION_REMOVED:
      return removeConnection(state, action);
    default:
      return INITIAL_STATE;
  }
}
