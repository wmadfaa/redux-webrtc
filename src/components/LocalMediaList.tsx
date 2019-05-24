import { ReactNode } from "react";
import { connect } from "react-redux";
import { Media } from "../redux/Definitions";
import selectors from "../redux/selectors";

export interface LocalMediaListRenderProps {
  media: Media[];
  remote?: boolean;
  local?: boolean;
  audio?: boolean;
  video?: boolean;
  shared?: boolean;
  screen?: boolean;
  removeMedia?: (id: string) => void;
  shareLocalMedia?: (id: string) => void;
  stopSharingLocalMedia?: (id: string) => void;
}
export interface ILocalMediaListProps extends LocalMediaListRenderProps {
  render?: (props: LocalMediaListRenderProps) => ReactNode;
  children?: ReactNode | ((props: LocalMediaListRenderProps) => ReactNode);
}

const LocalMediaList = ({
  audio,
  media,
  removeMedia,
  screen,
  shareLocalMedia,
  shared,
  stopSharingLocalMedia,
  video,
  render,
  children
}: ILocalMediaListProps): {} | null | undefined => {
  const renderProps = {
    audio,
    media: media || [],
    removeMedia,
    screen,
    shareLocalMedia,
    shared,
    stopSharingLocalMedia,
    video
  };

  if (render instanceof Function) return render(renderProps);
  if (children instanceof Function) return children(renderProps);
  if (children) return children;
};

const mapStateToProps = (state, props) => {
  const desiredMedia =
    (props.audio && !props.video && "audio") ||
    (!props.audio && props.video && "video");
  const media =
    (props.shared && selectors.media.getSharedMedia(state, desiredMedia)) ||
    selectors.media.getLocalMedia(state, desiredMedia) ||
    [].filter(media => {
      if (media.kind === "video" && props.screen !== undefined)
        return media.screenCapture === props.screen;
      if (media.shared && props.shared === false) return false;
      return true;
    });

  return { ...props, media };
};
const mapDispatchToProps = dispatch => ({
  removeMedia: id => dispatch(Actions.removeMedia(id)),
  shareLocalMedia: id => dispatch(Actions.shareLocalMedia(id)),
  stopSharingLocalMedia: id => dispatch(Actions.stopSharingLocalMedia(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalMediaList);
