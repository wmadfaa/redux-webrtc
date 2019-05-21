import { State } from "../reducers";
import { APIConfig } from "../Definitions";

// import { TelemetryEvent } from './actions';
// import { SignalingClient } from './signaling';

export const getAPIConfig = (state: State): APIConfig => state.api.config;

export const getConfigURL = (state: State): string => state.api.configUrl;

export const getClient = (state: State): SignalingClient =>
  state.api.signalingClient;

export const getQueuedTelemetry = (state: State): TelemetryEvent[] =>
  state.api.queuedTelemetry;

export default {
  getAPIConfig,
  getConfigURL
};
