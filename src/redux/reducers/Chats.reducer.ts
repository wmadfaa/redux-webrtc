import * as constants from "../Constants";

const INITIAL_STATE = {};

export const editChat = (original, replacement) => {
  if (!original) {
    return replacement;
  }
  return { ...replacement, editedTime: replacement.time, time: original.time };
};

export const addChat = (state, action) => {
  const chat = action.payload;
  const existing = state[chat.id];

  if (action.type === constants.CHAT_INCOMING) {
    if (chat.replace) {
      const original = state[chat.replace];
      if (original && original.direction === constants.DIRECTION_OUTGOING) {
        return {
          ...state,
          [chat.id]: {
            ...existing,
            acked: true,
            body: chat.body
          }
        };
      }
    }
    if (!existing) {
      return { ...state, [chat.id]: chat };
    }
    if (existing.direction === constants.DIRECTION_OUTGOING) {
      return {
        ...state,
        [chat.id]: {
          ...existing,
          acked: true,
          body: chat.body
        }
      };
    }
  }
  if (action.type === constants.CHAT_OUTGOING) {
    return { ...state, [chat.id]: editChat(existing, chat) };
  }
  return state;
};

export default function(state, action) {
  switch (action.type) {
    case constants.CHAT_INCOMING:
      return addChat(state, action);
    case constants.CHAT_OUTGOING:
      return addChat(state, action);
    default:
      return INITIAL_STATE;
  }
}
