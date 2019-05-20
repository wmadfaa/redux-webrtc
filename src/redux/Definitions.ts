export interface ICEServer {
  host: string;
  port: number;
  type: string;
  transport?: string;
  username?: string;
  password?: string;
}
export interface APIConfig {
  apiVersion: string;
  userId: string;
  id: string;
  customerData: object;
  credential: string;
  roomConfigUrl: string;
  signalingUrl: string;
  telemetryUrl: string;
  orgId: string;
  iceServers: ICEServer[];
  screensharingExtensions: {
    chrome: string;
  };
}
export interface RoomConfig {
  roomAddress: string;
}
export interface User {
  displayName: string;
  mediaEnabled: boolean;
  requestingMedia: "none" | "audio" | "video";
  pushToTalk: boolean;
  voiceActivityThreshold: number;
  audioOutputDeviceId?: string;
  globalVolumeLimit: number;
}
export interface Room {
  id: string;
  address: string;
  autoJoinCall: boolean;
  passwordRequired: boolean;
  password: string;
  unreadCount: number;
  joined: boolean;
  joinedAt?: Date;
  providedName: string;
  providedPassword?: string;
  selfAddress: string;
  selfAffiliation: string;
  selfRole: string;
  roomState: "joining" | "joined" | "password-required" | "failed" | "ended";
}
export interface Call {
  roomAddress: string;
  state: "offline" | "starting" | "active" | "hold";
  recordable: boolean;
  recordingState: "offline" | "starting" | "active";
  allowedMedia: "video" | "audio" | "none";
  allowedVideoRoles: string[];
  allowedAudioRoles: string[];
  joined: boolean;
  joinedAt?: Date;
  requestingMedia: "video" | "audio" | "none" | undefined;
}
export interface Peer {
  id: string;
  roomAddress: string;
  address: string;
  displayName: string;
  affiliation: string;
  role: string;
  requestingAttention: boolean;
  chatState: "active" | "composing" | "paused";
  rtt: string;
  customerData: object;
  joinedCall: boolean;
  joinedCallAt?: Date;
  joinedRoomAt?: Date;
  speaking: boolean;
  lastSpokeAt?: Date;
  volume: number;
  volumeLimit: number;
  requestingMedia: "video" | "audio" | "none";
  muted: boolean;
}
export interface Chat {
  direction: "incoming" | "outgoing";
  id: string;
  roomAddress: string;
  senderAddress?: string;
  body: string;
  displayName: string;
  time: Date;
  acked: boolean;
  editedTime?: Date;
}
export interface ChatGroup {
  senderAddress: string;
  direction: "incoming" | "outgoing";
  displayName: string;
  chats: Chat[];
  peer?: Peer;
  startTime?: Date;
  endTime?: Date;
}
export interface PeerConnection {
  id: string;
  peerAddress: string;
  connectionState: string;
  sendingAudioMediaId: string;
  sendingVideoMediaId: string;
  receivingAudioMediaId: string;
  receivingVideoMediaId: string;
}
export interface Media {
  hark?: Hark;
  id: string;
  source: "local" | "remote";
  kind: "audio" | "video";
  track: MediaStreamTrack;
  stream: MediaStream;
  localDisabled: boolean;
  owner?: string;
  roomAddress?: string;
  remoteDisabled: boolean;
  renderMirrored: boolean;
  screenCapture: boolean;
  speaking: boolean;
  lastSpokeAt?: Date;
  utilityStream?: MediaStream;
  volume: number;
  shared?: boolean;
  loaded?: boolean;
  height?: number;
  width?: number;
  replaces?: string;
  inputLost?: number;
  inputDetected?: boolean;
  createdAt: number;
  externalDisabled?: boolean;
}
export interface DevicePermissions {
  hasAudioOutput: boolean;
  hasCamera: boolean;
  hasMicrophone: boolean;
  cameraPermissionGranted: boolean;
  cameraPermissionDenied: boolean;
  microphonePermissionDenied: boolean;
  microphonePermissionGranted: boolean;
  requestingCapture: boolean;
  requestingCameraCapture: boolean;
  requestingMicrophoneCapture: boolean;
}
