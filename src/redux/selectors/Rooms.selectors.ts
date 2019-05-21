import { State } from "../reducers";
import { Room } from "../Definitions";

export const getRooms = (
  state: State
): {
  [key: string]: Room;
} => state.rooms;

export const getRoomByAddress = (
  state: State,
  roomAddress: string
): Room => state.rooms[roomAddress];

export const getRoomByProvidedName = (
  state: State,
  roomName: string
): Room | undefined => {
  const room: string | undefined = Object.keys(state.rooms).find(
    id => state.rooms[id].providedName === roomName
  );
  if (room) return state.rooms[room];
};
