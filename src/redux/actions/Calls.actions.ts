import * as constants from "../Constants";
import selectors from "../selectors";

import { removeAllMedia } from "./Media.actions";

export const joinCall = (roomAddress, desiredMedia) => {
  return (dispatch, getState) => {
    dispatch({
      payload: {
        desiredMedia: desiredMedia,
        roomAddress: roomAddress
      },
      type: constants.JOIN_CALL
    });
    const state = getState();
    const client = selectors.api.getClient(state);
    if (client) {
      client.sendRoomPresence(roomAddress);
      client.mesh.updateConnections();
    }
  };
};

export const leaveCall = roomAddress => {
  return (dispatch, getState) => {
    const state = getState();
    const originalCalls = selectors.calls.getJoinedCalls(state);
    dispatch({
      payload: {
        roomAddress: roomAddress
      },
      type: constants.LEAVE_CALL
    });
    const updatedState = getState();
    const remainingCalls = selectors.calls.getJoinedCalls(updatedState);
    const client = selectors.api.getClient(state);
    if (client) {
      client.sendRoomPresence(roomAddress);
      client.mesh.updateConnections();
      const speaking = selectors.user.userIsSpeaking(state);
      if (speaking) {
        client.sendAllCallsSpeakingUpdate(true);
      }
    }
    if (originalCalls.length > 0 && remainingCalls.length === 0) {
      dispatch(removeAllMedia());
    }
  };
};

export const setDesiredMediaForCall = (roomAddress, desiredMedia) => {
  return (dispatch, getState) => {
    dispatch({
      payload: {
        desiredMedia: desiredMedia,
        roomAddress: roomAddress
      },
      type: constants.SET_CALL_PREFERENCE
    });
    const state = getState();
    const client = selectors.api.getClient(state);
    if (client) {
      client.sendRoomPresence(roomAddress);
      client.mesh.updateConnections();
    }
  };
};
