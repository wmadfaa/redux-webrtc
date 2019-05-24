import React, {
  FunctionComponent,
  useState,
  useEffect,
  HTMLProps,
  FormEvent,
  KeyboardEvent
} from "react";
import RTT from "realtime-text";
import { connect } from "react-redux";
import usePrevious from "../hooks/usePrevious";

interface IChatInputProps extends HTMLProps<HTMLTextAreaElement> {
  room: string;
  id?: string;
  disabled?: boolean;
  rtt?: boolean;
  placeholder?: string;
  onChat?: (opts: any) => void; // opts: Actions.ChatOptions
  onChatState?: (state: ChatState) => void;
  onRtt?: (data: RTT.RTTEvent) => void;
}
type ChatState = "active" | "composing" | "paused";

const ChatInput: FunctionComponent<IChatInputProps> = props => {
  const {
    id,
    rtt,
    onRtt,
    children,
    disabled,
    onChat,
    onChatState,
    placeholder
  } = props;
  const prevProps = usePrevious<IChatInputProps>({ ...props });

  const [chatState, setChatState] = useState<ChatState>("active");
  const [message, setMessage] = useState("");
  const [rttBuffer, setRttBuffer] = useState<RTT.InputBuffer>(
    new RTT.InputBuffer()
  );

  let rttInterval: NodeJS.Timeout;
  let pausedTimeout: NodeJS.Timeout;
  let rttTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (!prevProps.rtt && rtt) {
      if (onRtt) onRtt(rttBuffer.start());
      rttBuffer.update(message);
    }
    if (prevProps.rtt && !rtt) {
      if (onRtt) onRtt(rttBuffer.stop());
      clearInterval(rttInterval);
    }
  }, [rtt]);

  const startSendingRtt = (): void => {
    if (!rttInterval && rtt) {
      rttInterval = setInterval(rttSend, 700);
      rttTimeout = setTimeout(rttSend, 100);
    }
  };

  const rttUpdate = (data: string = "") => {
    rttBuffer.update(data);
    startSendingRtt();
  };

  const rttSend = () => {
    if (!rtt) return;
    const diff = rttBuffer.diff();
    if (diff && onRtt) {
      onRtt(diff);
    }
  };

  const commitMessage = () => {
    if (disabled || message.length === 0) return;
    clearTimeout(pausedTimeout);
    clearInterval(rttInterval);
    setMessage("");
    setChatState("active");
    rttBuffer.commit();
    if (onChat)
      onChat({
        body: message
      });
  };

  const updateChatState = (state: ChatState) => {
    if (pausedTimeout) {
      clearTimeout(pausedTimeout);
    }
    if (state === "composing") {
      pausedTimeout = setTimeout(function() {
        updateChatState("paused");
      }, 10000);
    }
    if (state !== chatState) {
      if (onChatState) {
        onChatState(state);
      }
    }
    setChatState(state);
  };

  const onInput = (evt: FormEvent<HTMLTextAreaElement>) => {
    const { value } = evt.target as HTMLTextAreaElement;
    rttUpdate(value);
    if (value !== "") {
      updateChatState("composing");
    }
    if (message !== "" && value === "") {
      updateChatState("active");
    }
    setMessage(value);
  };

  const onKeyPress = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === "Enter" && !evt.shiftKey) {
      evt.preventDefault();
      commitMessage();
    }
  };

  return (
    <textarea
      id={id}
      value={message}
      placeholder={placeholder}
      disabled={disabled}
      onInput={onInput}
      onKeyPress={onKeyPress}
    >
      {children}
    </textarea>
  );
};

const mapStateToProps = (state, props) => {
  return props;
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    onChat: function(opts) {
      return dispatch(Actions.sendChat(props.room, opts));
    },
    onChatState: function(state) {
      return dispatch(Actions.sendChatState(props.room, state));
    },
    onRtt: function(data) {
      return dispatch(Actions.sendRTT(props.room, data));
    }
  };
}; 

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatInput);
