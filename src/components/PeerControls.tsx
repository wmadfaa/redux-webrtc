import { ReactNode } from "react";
import { connect } from "react-redux";
import { Peer } from "../redux/Definitions";
import selectors from "../redux/selectors";

export interface PeerControlsRenderProps {
  peer: Peer;
  isMuted: boolean;
  isSpeaking: boolean;
  hasActiveMicrophone: boolean;
  mute: () => void;
  unmute: () => void;
  kick: () => void;
  setVolumeLimit: (volume: number) => void;
}

export interface IPeerControlsProps extends PeerControlsRenderProps {
  render?: (props: PeerControlsRenderProps) => ReactNode;
  children?: ReactNode | ((props: PeerControlsRenderProps) => ReactNode);
}

const PeerControls = ({
  hasActiveMicrophone,
  isMuted,
  isSpeaking,
  kick,
  mute,
  peer,
  setVolumeLimit,
  unmute,
  render,
  children
}: IPeerControlsProps): {} | null | undefined => {
  const renderProps = {
    hasActiveMicrophone,
    isMuted,
    isSpeaking,
    kick,
    mute,
    peer,
    setVolumeLimit,
    unmute
  };

  if (render instanceof Function) return render(renderProps);
  if (children instanceof Function) return children(renderProps);
  if (children) return children;
};

const mapStateToProps = (state, props) => {
  var peer = selectors.peers.getPeerByAddress(state, props.peer.address);
  var media = selectors.media.getMediaForPeer(
    state,
    props.peer.address,
    "audio"
  );
  var anyRemoteEnabled =
    media.filter(audio => !audio.remoteDisabled).length > 0;
  return {
    hasActiveMicrophone: anyRemoteEnabled,
    isMuted: peer.muted || false,
    isSpeaking: peer.speaking || false
  };
};

const mapDispatchToProps = (dispatch, { peer }) => ({
  kick: () => dispatch(Actions.kickPeer(peer.roomAddress, peer.address)),
  mute: () => dispatch(Actions.mutePeer(peer.address)),
  setVolumeLimit: volume =>
    dispatch(Actions.limitPeerVolume(peer.address, volume)),
  unmute: () => dispatch(Actions.unmutePeer(peer.address))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerControls);
