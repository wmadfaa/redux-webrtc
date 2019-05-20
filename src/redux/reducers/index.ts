import { combineReducers, Reducer, AnyAction } from "redux";

import { User } from "../Definitions";
import api, { ApiState } from "./API.reducer";
import calls, { CallsState } from "./Calls.reducer";
import chats, { ChatsState } from "./Chats.reducer";
import connections, { ConnectionsState } from "./Connections.reduce";
import devices, { DevicesState } from "./Devices.reducer";
import media, { MediaState } from "./Media.reducer";
import peers, { PeersState } from "./Peers.reducer";
import rooms, { RoomsState } from "./Rooms.reducer";
import user from "./User.reducer";

export interface State {
  api: ApiState;
  calls: CallsState;
  chats: ChatsState;
  connections: ConnectionsState;
  devices: DevicesState;
  media: MediaState;
  peers: PeersState;
  rooms: RoomsState;
  user: User;
}

export const reducers: Reducer<State> = combineReducers<State>({
  api,
  calls,
  chats,
  connections,
  devices,
  media,
  peers,
  rooms,
  user
});

export default reducers;
