import { State } from "../reducers";
import { Media } from "../Definitions";

import { getCallForRoom } from "./Calls.selectors";

export const getMedia = (
  state: State
): {
  [key: string]: Media;
} => state.media;

export const getMediaTrack = (state: State, id: string): Media | undefined =>
  state.media[id];

export const getMediaForPeer = (
  state: State,
  peerAddress: string,
  kind?: "audio" | "video"
): Media[] => {
  return Object.keys(state.media).reduce<Media[]>((acc, id) => {
    const media = state.media[id];
    if ((!kind || kind === media.kind) && media.owner === peerAddress) {
      return [...acc, media];
    }
    return [...acc];
  }, []);
};

export const getDesiredMediaTypes = (
  state: State,
  roomAddress?: string
): "audio" | "video" | "none" => {
  const defaultRequest = state.user.requestingMedia;
  if (roomAddress) {
    const call = getCallForRoom(state, roomAddress);
    if (call) {
      return call.requestingMedia || defaultRequest;
    }
  }
  return defaultRequest;
};

export const getLocalMedia = (
  state: State,
  kind?: "audio" | "video"
): Media[] =>
  Object.keys(state.media)
    .reduce<Media[]>((acc, id) => {
      const media = state.media[id];
      if ((!kind || kind === media.kind) && media.source === "local") {
        return [...acc, media];
      }
      return [...acc];
    }, [])
    .sort((a: Media, b: Media) => a.createdAt - b.createdAt);

export const getRemoteMedia = (
  state: State,
  kind?: "audio" | "video"
): Media[] =>
  Object.keys(state.media).reduce<Media[]>((acc, id) => {
    const media = state.media[id];
    if ((!kind || kind === media.kind) && media.source === "remote") {
      return [...acc, media];
    }
    return [...acc];
  }, []);

export const getSharedMedia = (
  state: State,
  kind?: "audio" | "video"
): Media[] =>
  Object.keys(state.media).reduce<Media[]>((acc, id) => {
    const media = state.media[id];
    if (
      (!kind || kind === media.kind) &&
      media.source === "local" &&
      media.shared
    ) {
      return [...acc, media];
    }
    return [...acc];
  }, []);
