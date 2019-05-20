import * as constants from "../Constants";

const INITIAL_STATE = {};

export const addPeer = (state, action) => {
  if (state[action.payload.peerAddress]) {
    return updatePeer(state, {
      payload: {
        peerAddress: action.payload.peerAddress,
        updated: action.payload
      },
      type: constants.PEER_UPDATED
    });
  }
  const now = new Date(Date.now());
  return {
    ...state,
    [action.payload.peerAddress]: {
      address: action.payload.peerAddress,
      affiliation: action.payload.affiliation,
      chatState: "active",
      customerData: action.payload.customerData || {},
      displayName: action.payload.displayName || "",
      id: action.payload.id,
      joinedCall: action.payload.joinedCall || false,
      joinedCallAt: action.payload.joinedCall ? now : undefined,
      joinedRoomAt: now,
      lastSpokeAt: undefined,
      muted: false,
      requestingAttention: false,
      requestingMedia: action.payload.requestingMedia || "none",
      role: action.payload.role,
      roomAddress: action.payload.roomAddress,
      rtt: "",
      speaking: false,
      volume: -Infinity,
      volumeLimit: 0.8
    }
  };
};

export const updatePeer = (state, action) => {
  const existingPeer = state[action.payload.peerAddress];
  if (!existingPeer) {
    return state;
  }

  const now = new Date(Date.now());
  const lastSpokeAt =
    existingPeer.speaking && action.payload.updated.speaking === false
      ? now
      : existingPeer.lastSpokeAt;

  const leftCall =
    existingPeer.joinedCall && action.payload.updated.joinedCall === false;

  return {
    ...state,
    [action.payload.peerAddress]: {
      ...existingPeer,
      ...action.payload.updated,
      joinedCallAt: leftCall ? undefined : existingPeer.joinedCallAt || now,
      lastSpokeAt: lastSpokeAt
    }
  };
};

export const removePeer = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.peerAddress];
  return result;
};

export const removeRoomPeers = (state, action) => {
  return Object.keys(state).filter(
    peer =>
      !(
        state[peer].source === "remote" &&
        state[peer].roomAddress === action.payload.roomAddress
      )
  );
};

export default function(state, action) {
  switch (action.type) {
    case constants.PEER_ONLINE:
      return addPeer(state, action);
    case constants.PEER_OFFLINE:
      return removePeer(state, action);
    case constants.PEER_UPDATED:
      return updatePeer(state, action);
    case constants.LEAVE_ROOM:
      return removeRoomPeers(state, action);
    default:
      return INITIAL_STATE;
  }
}
