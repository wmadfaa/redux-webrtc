import UUID from "uuid";
import * as constants from "../Constants";
import selectors from "../selectors";

export const sendChat = (roomAddress, opts) => {
  return (dispatch, getState) => {
    const state = getState();
    const client = selectors.api.getClient(state);
    const id = opts.id || UUID.v4();
    const displayName =
      opts.displayName || selectors.user.getUserDisplayName(state);
    client.xmpp.sendMessage({
      body: opts.body,
      chatState: "active",
      id: id,
      nick: displayName,
      replace: opts.replace,
      to: roomAddress,
      type: "groupchat"
    });
    dispatch({
      payload: {
        acked: false,
        body: opts.body,
        direction: constants.DIRECTION_OUTGOING,
        displayName: displayName,
        id: id,
        replace: opts.replace,
        roomAddress: roomAddress,
        time: new Date()
      },
      type: constants.CHAT_OUTGOING
    });
  };
};

export const sendChatState = (roomAddress, chatState) => {
  return (dispatch, getState) => {
    const client = selectors.api.getClient(getState());
    client.xmpp.sendMessage({
      chatState: chatState,
      to: roomAddress,
      type: "groupchat"
    });
    dispatch({
      payload: {
        chatState: chatState,
        roomAddress: roomAddress
      },
      type: constants.CHAT_STATE_OUTGOING
    });
  };
};

export const receiveChat = (roomAddress, senderAddress, opts) => {
  return {
    payload: {
      acked: true,
      body: opts.body,
      direction: constants.DIRECTION_INCOMING,
      displayName: opts.displayName,
      id: opts.id,
      replace: opts.replace,
      roomAddress: roomAddress,
      senderAddress: senderAddress,
      time: opts.time || new Date()
    },
    type: constants.CHAT_INCOMING
  };
};

export const sendRTT = (roomAddress, rtt) => {
  return (dispatch, getState) => {
    var client = selectors.api.getClient(getState());
    var chatState;
    if (rtt.event !== "init" && rtt.event !== "cancel") {
      chatState = "composing";
    }
    client.xmpp.sendMessage({
      chatState: chatState,
      rtt: rtt,
      to: roomAddress,
      type: "groupchat"
    });
    dispatch({
      payload: {
        roomAddress: roomAddress,
        rtt: rtt
      },
      type: constants.RTT_OUTGOING
    });
  };
};
