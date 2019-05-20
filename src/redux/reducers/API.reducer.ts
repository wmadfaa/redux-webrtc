import { AnyAction } from "redux";
import { APIConfig } from "../Definitions";
import * as constants from "../Constants";

export interface ApiState {
  connectionAttempts: number;
  connectionState: string;
  signalingClient?: any; // SignalingClient
  config: APIConfig;
  configUrl: string;
  queuedTelemetry: any; // TelemetryEvent[]
  token: string;
}

const INITIAL_STATE: ApiState = {
  config: {
    apiVersion: "",
    credential: "",
    customerData: {},
    iceServers: [],
    id: "",
    orgId: "",
    roomConfigUrl: "",
    signalingUrl: "",
    telemetryUrl: "",
    userId: "",
    screensharingExtensions: {
      chrome: ""
    }
  },
  configUrl: "",
  connectionAttempts: 0,
  connectionState: "disconnected",
  queuedTelemetry: [],
  signalingClient: undefined,
  token: ""
};

export default function(state: ApiState, action: AnyAction): ApiState {
  switch (action.type) {
    case constants.SIGNALING_CLIENT:
      return { ...state, signalingClient: action.payload };
    case constants.SIGNALING_CLIENT_SHUTDOWN:
      return {
        ...state,
        connectionState: "disconnected",
        signalingClient: undefined
      };
    case constants.CONNECTION_STATE_CHANGE:
      return { ...state, connectionState: action.payload };
    case constants.RECEIVED_CONFIG: {
      const config = action.payload.config;
      const configUrl = action.payload.configUrl;
      const token = action.payload.token || "";
      return {
        ...state,
        config: { ...state.config, ...config },
        configUrl: configUrl,
        token: token
      };
    }
    case constants.QUEUE_TELEMETRY:
      return {
        ...state,
        queuedTelemetry: [...state.queuedTelemetry, action.payload]
      };
    case constants.TELEMETRY_SUCCESS:
      return {
        ...state,
        queuedTelemetry: state.queuedTelemetry.slice(action.payload)
      };
    default: {
      state = INITIAL_STATE;
    }
  }
  return state;
}
