import { State } from "../reducers";
import { Call, Peer } from "../Definitions";

import { getRoomByAddress } from "./Rooms.selectors";

export const getJoinedCalls = (state: State): Call[] => {
  return Object.keys(state.calls).reduce<Call[]>((acc, id) => {
    const call = state.calls[id];
    const room = getRoomByAddress(state, call.roomAddress);
    if (call.joined && room && room.joined) {
      return [...acc, call];
    }
    return [...acc];
  }, []);
};

export const getCallForRoom = (state: State, roomAddress: string): Call =>
  state.calls[roomAddress];

export const getActiveSpeakersForCall = (
  state: State,
  roomAddress: string
): Peer[] => {
  return Object.keys(state.peers).reduce<Peer[]>((acc, id) => {
    const peer = state.peers[id];
    if (peer.roomAddress === roomAddress && peer.joinedCall && peer.speaking) {
      return [...acc, peer];
    }
    return [...acc, peer];
  }, []);
};
