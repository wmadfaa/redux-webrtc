import { State } from "../reducers";
import { Chat, ChatGroup, Peer } from "../Definitions";

import { getPeerByAddress } from "./Peers.selectors";
import { getUserDataForRoom } from "./user.selectors";
import * as constants from "../Constants";

export const getChatsForRoom = (state: State, roomAddress: string): Chat[] => {
  return Object.keys(state.chats).reduce<Chat[]>((acc, id) => {
    const chat = state.chats[id];
    if (chat.roomAddress === roomAddress) {
      return [...acc, chat];
    }
    return [...acc];
  }, []);
};

export const getGroupedChatsForRoom = (
  state: State,
  roomAddress: string,
  maxDuration: number = 5 * 60
): ChatGroup[] => {
  const groupedChats: ChatGroup[] = [];
  const chats: Chat[] = getChatsForRoom(state, roomAddress);
  let lastGroup: ChatGroup;

  chats.forEach(chat => {
    const newSender =
      !lastGroup || chat.senderAddress !== lastGroup.senderAddress;

    const prevChat = lastGroup
      ? lastGroup.chats[lastGroup.chats.length - 1]
      : undefined;

    const newDisplayName =
      !lastGroup ||
      (prevChat &&
        chat.displayName &&
        chat.displayName !== prevChat.displayName);

    const expired =
      !lastGroup ||
      Number(chat.time) > Number(lastGroup.chats[0].time) + maxDuration * 1000;

    if (newSender || newDisplayName || expired) {
      let peer = getPeerByAddress(state, chat.senderAddress) || {};
      if (chat.direction === "outgoing") {
        peer = getUserDataForRoom(state, roomAddress); // ** //
      }
      lastGroup = {
        chats: [chat],
        direction: chat.direction,
        displayName: peer.displayName || chat.displayName,
        endTime: chat.time,
        peer: peer,
        senderAddress: chat.senderAddress,
        startTime: chat.time
      };
      groupedChats.push(lastGroup);
    } else if (lastGroup) {
      lastGroup.chats.push(chat);
      lastGroup.endTime = chat.time;
    }
  });
  return groupedChats;
};

export const getLastSentChat = (state: State, roomAddress: string): Chat => {
  const chats = getChatsForRoom(state, roomAddress);
  return chats
    .filter(chat => chat.direction === constants.DIRECTION_OUTGOING)
    .slice(-1)[0];
};

export const getChatComposers = (state: State, roomAddress: string): Peer[] =>
  Object.keys(state.peers).reduce<Peer[]>((acc, id) => {
    const peer = state.peers[id];
    if (peer.roomAddress === roomAddress && peer.chatState === "composing") {
      return [...acc, peer];
    }
    return [...acc];
  }, []);
