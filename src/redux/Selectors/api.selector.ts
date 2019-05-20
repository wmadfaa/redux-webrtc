import { State } from "../reducers";
import { APIConfig } from "../Definitions";

export const getAPIConfig = (state: State): APIConfig => state.api.config;

export const getConfigURL = (state: State): string => state.api.configUrl;

export default {
  getAPIConfig,
  getConfigURL
};
