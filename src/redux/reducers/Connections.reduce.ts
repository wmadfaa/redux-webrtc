import { AnyAction, Reducer } from "redux";
import { PeerConnection } from "../Definitions";
import * as constants from "../Constants";

export interface ConnectionsState {
  [key: string]: PeerConnection;
}

const INITIAL_STATE: ConnectionsState = {};

type ConnectionsReducerType = (
  state: ConnectionsState,
  action: AnyAction
) => ConnectionsState;

export const addConnection: ConnectionsReducerType = (state, action) => {
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

export const updateConnection: ConnectionsReducerType = (state, action) => {
  if (!state[action.payload.id]) {
    return state;
  }
  return {
    ...state,
    [action.payload.id]: {
      ...(state[action.payload.id] || {}),
      peerAddress: action.payload.peerAddress,
      ...action.payload.updated
    }
  };
};

export const removeConnection: ConnectionsReducerType = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.id];
  return result;
};

const reducer: Reducer = (
  state: ConnectionsState,
  action: AnyAction
): ConnectionsState => {
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
};

export default reducer;
