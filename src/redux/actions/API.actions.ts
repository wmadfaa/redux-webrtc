import { ThunkAction } from "redux-thunk";
import { State } from "../reducers";
import * as constants from "../Constants";
import selectors from "../selectors";
import { APIConfig } from "../Definitions";

export const sleep = async (
  timeout: number,
  throwError: boolean = false
): Promise<{}> =>
  new Promise((res, rej) =>
    setTimeout(() => (throwError ? rej() : res()), timeout)
  );

export interface CreateSignalingClient {
  payload: any; // SignalingClient
  type: typeof constants.SIGNALING_CLIENT;
}
export interface ConnectionStateChange {
  payload: string;
  type: typeof constants.CONNECTION_STATE_CHANGE;
}
export interface ReceivedConfig {
  payload: {
    configUrl: string;
    config: APIConfig;
    token?: string;
  };
  type: typeof constants.RECEIVED_CONFIG;
}
export interface ReceivedConfigError {
  type: typeof constants.RECEIVED_CONFIG_ERROR;
}
export interface QueueTelemetry {
  payload: any;
  type: typeof constants.QUEUE_TELEMETRY;
}
export interface TelemetrySuccess {
  payload: number;
  type: typeof constants.TELEMETRY_SUCCESS;
}
export interface TelemetryEvent {
  eventType: string;
  roomId: string;
  peerId: string;
  data: any;
}

export type Actions =
  | CreateSignalingClient
  | ConnectionStateChange
  | ReceivedConfig
  | ReceivedConfigError
  | QueueTelemetry
  | TelemetrySuccess;

let REPORTING_INTERVAL: NodeJS.Timeout;

export const disconnect: ThunkAction<void, State, void, any> = () => (
  dispatch,
  getState
) => {
  const signalingClient = selectors.api.getClient(getState());
  if (signalingClient) {
    signalingClient.disconnect();
  }
  dispatch({
    type: constants.SIGNALING_CLIENT_SHUTDOWN
  });
};

export const receivedConfig = (
  configUrl: string,
  config: APIConfig,
  userData?: string
): ReceivedConfig => ({
  payload: {
    config: config,
    configUrl: configUrl,
    token: userData
  },
  type: constants.RECEIVED_CONFIG
});

export const receivedConfigError = (err: Error): ReceivedConfigError => ({
  type: constants.RECEIVED_CONFIG_ERROR
});

export const queueTelemetry = (
  eventType: string,
  { roomId, peerId, data }: TelemetryEvent
): QueueTelemetry => {
  return {
    payload: {
      data: JSON.stringify(data),
      peerId: peerId,
      roomId: roomId
    },
    type: constants.QUEUE_TELEMETRY
  };
};

export const sendQueuedTelemetry = (): ThunkAction<
  void,
  State,
  void,
  TelemetrySuccess
> => (dispatch, getState) => {
  const state = getState();
  const config = selectors.api.getAPIConfig(state);
  const telemetryUrl = config.telemetryUrl;
  const queuedTelemetry = selectors.api.getQueuedTelemetry(state);
  const batchSize = Math.min(queuedTelemetry.length, 10);
  if (batchSize === 0) return;
  const batch = queuedTelemetry.slice(0, batchSize);
  if (!telemetryUrl) return;
  const payload = {
    body: JSON.stringify({
      batch: batch
    }),
    headers: {
      authorization: "Bearer " + config.credential
    },
    method: "POST"
  };
  fetch(telemetryUrl, payload).then(() => {
    dispatch(telemetrySucess(batchSize));
  });
};

export const telemetrySucess = (batchSize: number): TelemetrySuccess => {
  return {
    payload: batchSize,
    type: constants.TELEMETRY_SUCCESS
  };
};

export const enableTelemetry = (
  interval: number = 5000
): ThunkAction<void, State, void, TelemetrySuccess> => {
  return dispatch => {
    disableTelemetry();
    REPORTING_INTERVAL = setInterval(function() {
      dispatch(sendQueuedTelemetry());
    }, interval);
  };
};

export const disableTelemetry = (): void => {
  clearInterval(REPORTING_INTERVAL);
};

export const connectionStateChanged = (
  connectionState: string
): ConnectionStateChange => {
  return {
    payload: connectionState,
    type: constants.CONNECTION_STATE_CHANGE
  };
};
