import { State } from "../reducers";
import { APIConfig, Peer, User } from "../Definitions";

import { getAPIConfig } from "./api.selector";

export const getUserToken = (state: State): APIConfig => state.api.token;

export const getUser = (state: State): User => state.user;

export const getUserCustomerData = (state: State): object =>
  getAPIConfig(state).customerData;

export const getUserDisplayName = (state: State): string =>
  state.user.displayName;

export const getUserDataForRoom = (state: State, roomAddress: string): Peer => {
  const config = getAPIConfig(state);
  const room = getRoomByAddress(state, roomAddress);
  const call = getCallForRoom(state, roomAddress);
  const localAudio = getLocalMedia(state, "audio");
  const recentSpeaking = localAudio
    .filter(function(a) {
      return a.lastSpokeAt;
    })
    .sort(function(a, b) {
      const lastA = a.lastSpokeAt ? a.lastSpokeAt.valueOf() : 0;
      const lastB = b.lastSpokeAt ? b.lastSpokeAt.valueOf() : 0;
      return lastA - lastB;
    });
  return {
    address: room.selfAddress,
    affiliation: room.selfAffiliation,
    chatState: "active",
    customerData: getAPIConfig(state).customerData,
    displayName: getUserDisplayName(state), // ** //
    id: config.id,
    joinedCall: call.joined,
    joinedCallAt: call.joinedAt,
    joinedRoomAt: room.joinedAt,
    lastSpokeAt: recentSpeaking.length
      ? recentSpeaking[0].lastSpokeAt
      : undefined,
    muted: false,
    requestingAttention: false,
    requestingMedia: getDesiredMediaTypes(state, roomAddress),
    role: room.selfRole,
    roomAddress: roomAddress,
    rtt: "",
    speaking: userIsSpeaking(state),
    volume: 0,
    volumeLimit: 0.8
  };
};

export default {
  getUserToken,
  getUser,
  getUserCustomerData,
  getUserDisplayName,
  getUserDataForRoom
};
