import { ReactNode } from "react";
import { connect } from "react-redux";
import { Media } from "../redux/Definitions";

export interface MediaControlsRenderProps {
  media?: Media;
  enable?: () => void;
  disable?: () => void;
  isEnabled: boolean;
  isShared: boolean;
  remove?: () => void;
  share?: () => void;
  stopSharing?: () => void;
}

export interface IMediaControlsProps {
  media: Media;
  autoRemove?: boolean;
  enableMedia?: () => void;
  disableMedia?: () => void;
  removeLocalMedia?: () => void;
  shareLocalMedia?: () => void;
  stopSharingLocalMedia?: () => void;
  render?: (props: MediaControlsRenderProps) => ReactNode;
  children?: ReactNode | ((props: MediaControlsRenderProps) => ReactNode);
}

const MediaControls = ({
  disableMedia,
  enableMedia,
  media,
  removeLocalMedia,
  shareLocalMedia,
  stopSharingLocalMedia,
  autoRemove,
  render,
  children
}: IMediaControlsProps): {} | null | undefined => {
  const renderProps = {
    disable: disableMedia,
    enable: enableMedia,
    isEnabled: !media.localDisabled && !media.remoteDisabled,
    isShared: media.source === "local" && !!media.shared,
    media: media,
    remove: removeLocalMedia,
    share: shareLocalMedia,
    stopSharing: () => {
      stopSharingLocalMedia instanceof Function && stopSharingLocalMedia();
      if (autoRemove) {
        removeLocalMedia instanceof Function && removeLocalMedia();
        media.track.stop();
      }
    }
  };

  if (render instanceof Function) return render(renderProps);
  if (children instanceof Function) return children(renderProps);
  if (children) return children;
};

const mapDispatchToProps = (dispatch, { media }) => ({
  disableMedia: () => dispatch(Actions.disableMedia(media.id)),
  enableMedia: () => dispatch(Actions.enableMedia(media.id)),
  removeLocalMedia: () => dispatch(Actions.removeMedia(media.id)),
  shareLocalMedia: () => dispatch(Actions.shareLocalMedia(media.id)),
  stopSharingLocalMedia: () => dispatch(Actions.stopSharingLocalMedia(media.id))
});

export default connect(
  null,
  mapDispatchToProps
)(MediaControls);
