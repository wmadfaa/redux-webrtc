import { State } from "../reducers";
import { Peer } from "../Definitions";

export const getPeerByAddress = (
  state: State,
  peerAddress: string
): Peer | undefined => state.peers[peerAddress];

export const getPeersForRoom = (state: State, roomAddress: string): Peer[] =>
  Object.keys(state.peers).reduce<Peer[]>((acc, id) => {
    const peer = state.peers[id];
    if (peer.roomAddress === roomAddress) {
      return [...acc, peer];
    }
    return [...acc];
  }, []);

export const getPeersForCall = (state: State, roomAddress: string): Peer[] =>
  Object.keys(state.peers).reduce<Peer[]>((acc, id) => {
    const peer = state.peers[id];
    if (peer.roomAddress === roomAddress && peer.joinedCall) {
      return [...acc, peer];
    }
    return [...acc];
  }, []);

export const countPeersWantingVideo = (state: State): number => {
  let count = 0;
  Object.keys(state.peers).forEach(id => {
    var peer = state.peers[id];
    if (peer.requestingMedia === "video") {
      count += 1;
    }
  });
  return count;
};
