import * as constants from "../Constants";

export const addConnection = (peerAddress, sessionId) => {
  return {
    payload: {
      id: sessionId,
      peerAddress: peerAddress
    },
    type: constants.PEER_CONNECTION_ADDED
  };
};

export const removeConnection = (peerAddress, sessionId) => {
  return {
    payload: {
      id: sessionId,
      peerAddress: peerAddress
    },
    type: constants.PEER_CONNECTION_REMOVED
  };
};

export const updateConnection = (peerAddress, sessionId, updated) => {
  return {
    payload: {
      id: sessionId,
      peerAddress: peerAddress,
      updated: updated
    },
    type: constants.PEER_CONNECTION_UPDATED
  };
};
