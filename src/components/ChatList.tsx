import React, { FunctionComponent, ReactNode } from "react";
import { connect } from "react-redux";
import selectors from "../redux/selectors";
import { ChatGroup } from "../redux/Definitions";
import { State } from "../redux/reducers";

import StayDownContainer from "./StayDownContainer";

interface IChatListGroupProps extends ChatGroup {
  render?: (props: ChatGroup) => ReactNode;
}

export interface ChatListRenderProps {
  groups: ChatGroup[];
}

interface IChatListProps {
  room: string;
  className?: string;
  id?: string;
  groups?: ChatGroup[];
  maxGroupDuration?: number;
  render?: (props: ChatListRenderProps) => ReactNode;
  renderGroup?: (props: ChatGroup) => ReactNode;
  children?: ReactNode | ((props: ChatListRenderProps) => ReactNode);
}

export const ChatListGroup: FunctionComponent<IChatListGroupProps> = ({
  render,
  ...props
}) => {
  const { children, ...rest } = props;
  if (render) return render(props);
  if (children instanceof Function) return children(rest);

  return (
    <div {...rest}>
      <span>{rest.displayName}</span>
      {rest.chats.map(chat => (
        <div>{chat.body}</div>
      ))}
    </div>
  );
};

const ChatList = (props: IChatListProps): {} | null | undefined => {
  const { groups = [], render, children, renderGroup, ...rest } = props;
  if (render) return render({ groups });
  if (children instanceof Function) return children({ groups });
  if (children) return children;

  return (
    <StayDownContainer {...rest}>
      {groups.map(group => {
        if (renderGroup) return renderGroup(group);
        return <ChatListGroup {...group} />;
      })}
    </StayDownContainer>
  );
};

const mapStateToProps = (state: State, props: IChatListProps) => {
  if (!props.room) return { ...props, groups: [] };
  return {
    ...props,
    groups:
      selectors.chats.getGroupedChatsForRoom(
        state,
        props.room,
        props.maxGroupDuration
      ) || []
  };
};

export default connect<State, {}, IChatListProps>(mapStateToProps)(ChatList);
