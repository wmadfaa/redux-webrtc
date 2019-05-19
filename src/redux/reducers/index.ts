import { combineReducers } from "redux";

import api from "./API.reducer";
import calls from "./Calls.reducer";
import chats from "./Chats.reducer";
import connections from "./Connections.reduce";
import devices from "./Devices.reducer";
import media from "./Media.reducer";
import peers from "./Peers.reducer";
import rooms from "./Rooms.reducer";
import user from "./User.reducer";

export default combineReducers({
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
