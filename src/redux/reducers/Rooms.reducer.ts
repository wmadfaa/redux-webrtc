import * as constants from "../Constants";

const INITIAL_STATE = {};

export const addRoom = (state, action) => {
  return {
    ...state,
    [action.payload.roomAddress]: {
      address: action.payload.roomAddress,
      autoJoinCall: !!action.payload.autoJoinCall,
      id: "",
      joined: false,
      joinedAt: undefined,
      password: action.payload.password || "",
      passwordRequired: false,
      providedName: action.payload.providedRoomName,
      providedPassword: action.payload.providedPassword,
      roomState: "joining",
      selfAddress: "",
      selfAffiliation: "none",
      selfRole: "none",
      unreadCount: 0
    }
  };
};

export const updateRoom = (state, action) => {
  const existingRoom = state[action.payload.roomAddress];
  if (!existingRoom) {
    return state;
  }

  if (action.type === constants.JOIN_ROOM_FAILED) {
    return {
      ...state,
      [action.payload.roomAddress]: {
        ...existingRoom,
        joined: false,
        joinedAt: undefined,
        password: "",
        passwordRequired: !!action.payload.passwordRequired,
        roomState: !!action.payload.passwordRequired
          ? "password-required"
          : "failed"
      }
    };
  }
  return {
    ...state,
    [action.payload.roomAddress]: {
      ...existingRoom,
      id: action.payload.id,
      joined: true,
      joinedAt: existingRoom.joinedAt || new Date(Date.now()),
      roomState: "joined",
      selfAddress: action.payload.selfAddress,
      selfAffiliation: action.payload.affiliation,
      selfRole: action.payload.role
    }
  };
};

export const updateRoomLock = (state, action) => {
  const existingRoom = state[action.payload.roomAddress];
  if (!existingRoom) {
    return state;
  }
  switch (action.type) {
    case constants.LOCK_ROOM:
      return {
        ...state,
        [action.payload.roomAddress]: {
          ...existingRoom,
          providedPassword: action.payload.password || ""
        }
      };
    case constants.ROOM_LOCKED:
      return {
        ...state,
        [action.payload.roomAddress]: {
          ...existingRoom,
          password: action.payload.password || "",
          passwordRequired: true,
          providedPassword: undefined
        }
      };
    case constants.ROOM_UNLOCKED:
      return {
        ...state,
        [action.payload.roomAddress]: {
          ...existingRoom,
          password: "",
          passwordRequired: false,
          providedPassword: undefined
        }
      };
    default:
      return state;
  }
};

export const removeRoom = (state, action) => {
  const { ...result } = state;
  delete result[action.payload.roomAddress];
  return result;
};

export default function(state, action) {
  switch (action.type) {
    case constants.SELF_UPDATED:
      return updateRoom(state, action);
    case constants.JOIN_ROOM:
      return addRoom(state, action);
    case constants.JOIN_ROOM_FAILED:
      return updateRoom(state, action);
    case constants.JOIN_ROOM_SUCCESS:
      return updateRoom(state, action);
    case constants.LEAVE_ROOM:
      return removeRoom(state, action);
    case constants.LOCK_ROOM:
    case constants.UNLOCK_ROOM:
    case constants.ROOM_LOCKED:
    case constants.ROOM_UNLOCKED:
      return updateRoomLock(state, action);
    default:
      return INITIAL_STATE;
  }
}
