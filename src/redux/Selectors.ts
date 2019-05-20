import * as constants from "./Constants";

export const getClient = state => {
  return state.api.signalingClient;
};

export const getQueuedTelemetry = state => {
  return state.api.queuedTelemetry;
};



export const getDesiredMediaTypes = (state, roomAddress) => {
  const defaultRequest = state.user.requestingMedia;
  if (roomAddress) {
    const call = getCallForRoom(state, roomAddress);
    if (call) {
      return call.requestingMedia || defaultRequest;
    }
  }
  return defaultRequest;
};

export const getPushToTalkEnabled = state => {
  return state.user.pushToTalk;
};

export const getPeerByAddress = (state, peerAddress) => {
  return state.peers[peerAddress];
};

export const getRooms = state => {
  return state.rooms;
};

export const getRoomByAddress = (state, roomAddress) => {
  return state.rooms[roomAddress];
};

export const getRoomByProvidedName = (state, roomName) => {
  return Object.keys(state.rooms).find(
    room => state.rooms[room].providedName === roomName
  );
};

export const getPeersForRoom = (state, roomAddress) => {
  return Object.keys(state.peers).filter(
    peer => state.peers[peer].roomAddress === roomAddress
  );
};

export const getChatsForRoom = (state, roomAddress) => {
  return Object.keys(state.chats).filter(
    chat => state.chats[chat].roomAddress === roomAddress
  );
};

export const getGroupedChatsForRoom = (
  state,
  roomAddress,
  maxDuration = 5 * 60
) => {
  const groupedChats = [];
  const chats = getChatsForRoom(state, roomAddress);
  let lastGroup;

  chats.forEach(chat => {
    const chat = chat.value;

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

export const getLastSentChat = (state, roomAddress) => {
  const chats = getChatsForRoom(state, roomAddress);
  return chats
    .filter(chat => chat.direction === constants.DIRECTION_OUTGOING)
    .slice(-1)[0];
};

export const getChatComposers = (state, roomAddress) => {
  const results = [];
  Object.keys(state.peers).forEach(_peer => {
    const peerId = state.peers[_peer];
    const peer = state.peers[peerId];
    if (peer.roomAddress === roomAddress && peer.chatState === "composing") {
      results.push(peer);
    }
  });
  return results;
};

export const getCallForRoom = (state, roomAddress) => {
  return state.calls[roomAddress];
};

export const getMedia = state => {
  return state.media;
};

export const getMediaTrack = (state, id) => {
  return state.media[id];
};

export const getDeviceForMediaTrack = (state, id) => {
  let deviceId;
  const track = getMediaTrack(state, id);
  const devices = state.devices.devices;

  if (!track) {
    return;
  }
  if (track.track.getSettings) {
    deviceId = track.track.getSettings().deviceId;
  }

  return devices.find(device => device.deviceId === deviceId);
};

export const getDevices = (state, kind) => {
  const devices = state.devices.devices;
  if (!kind) {
    return devices;
  }
  return devices.filter(device => device.kind === kind);
};

export const getDevicePermissions = state => {
  const devices = state.devices;
  return {
    cameraPermissionDenied: devices.cameraPermissionDenied,
    cameraPermissionGranted: devices.cameraPermissionGranted,
    hasAudioOutput: devices.hasAudioOutput,
    hasCamera: devices.hasCamera,
    hasMicrophone: devices.hasMicrophone,
    microphonePermissionDenied: devices.microphonePermissionDenied,
    microphonePermissionGranted: devices.microphonePermissionGranted,
    requestingCameraCapture: devices.requestingCameraCapture,
    requestingCapture: devices.requestingCapture,
    requestingMicrophoneCapture: devices.requestingMicrophoneCapture
  };
};

export const getMediaForPeer = (state, peerAddress, kind) => {
  return Object.keys(state.media).reduce((acc, id) => {
    const media = state.media[id];
    if ((!kind || kind === media.kind) && media.owner === peerAddress) {
      return [...acc, media];
    }
  }, []);
};

export const getLocalMedia = (state, kind) => {
  const result = Object.keys(state.media).reduce((acc, id) => {
    const media = state.media[id];
    if ((!kind || kind === media.kind) && media.source === "local") {
      return [...acc, media];
    }
  }, []);
  return result.sort((a, b) => a.createdAt - b.createdAt);
};

export const getRemoteMedia = (state, kind) => {
  return Object.keys(state.media).reduce((acc, id) => {
    const media = state.media[id];
    if ((!kind || kind === media.kind) && media.source === "remote") {
      return [...acc, media];
    }
  }, []);
};

export const getSharedMedia = (state, kind) => {
  return Object.keys(state.media).reduce((acc, id) => {
    const media = state.media[id];
    if (
      (!kind || kind === media.kind) &&
      media.source === "local" &&
      media.shared
    ) {
      return [...acc, media];
    }
  }, []);
};

export const getAudioOutputDevice = state => state.user.audioOutputDeviceId;

export const getGlobalVolumeLimit = state => state.user.globalVolumeLimit;

export const getJoinedCalls = state => {
  return Object.keys(state.calls).reduce((acc, id) => {
    const call = state.calls[id];
    const room = getRoomByAddress(state, call.roomAddress);
    if (call.joined && room && room.joined) {
      return [...acc, call];
    }
  }, []);
};

export const getPeersForCall = (state, roomAddress) => {
  return Object.keys(state.peers).reduce((acc, id) => {
    const peer = state.peers[id];
    if (peer.roomAddress === roomAddress && peer.joinedCall) {
      return [...acc, peer];
    }
  }, []);
};

export const getActiveSpeakersForCall = (state, roomAddress) => {
  return Object.keys(state.peers).reduce((acc, id) => {
    const peer = state.peers[id];
    if (peer.roomAddress === roomAddress && peer.joinedCall && peer.speaking) {
      return [...acc, peer];
    }
  }, []);
};


export const countPeersWantingVideo = state => {
  let count = 0;

  Object.keys(state.peers).forEach(id => {
    var peer = state.peers[id];
    if (peer.requestingMedia === "video") {
      count += 1;
    }
  });
  return count;
};

export const isSupportedBrowser = () =>
  !!("RTCPeerConnection" in window) && !!("mediaDevices" in navigator);

export const userIsSpeaking = state => {
  return (
    getLocalMedia(state, "audio").filter(
      audio =>
        !audio.localDisabled &&
        !audio.externalDisabled &&
        audio.shared &&
        audio.speaking
    ).length > 0
  );
};
