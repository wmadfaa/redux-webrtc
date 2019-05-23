import React, {
  FunctionComponent,
  useEffect,
  createRef,
  RefObject
} from "react";

import { Media } from "../redux/Definitions";

interface IAudioProps {
  media: Media;
  volume?: number;
  outputDevice?: string;
}

const Audio: FunctionComponent<IAudioProps> = ({ ...props }) => {
  const audio: RefObject<HTMLAudioElement> = createRef();

  useEffect(() => {
    setup();
  }, [props]);

  const setup = () => {
    if (audio.current) {
      audio.current.addEventListener("contextmenu", evt => {
        evt.preventDefault();
      });
      if (audio.current.srcObject !== props.media.stream) {
        audio.current.srcObject = props.media.stream;
      }
      if (props.volume || props.volume === 0) {
        audio.current.volume = props.volume;
      }
      if (
        props.media.localDisabled ||
        props.media.remoteDisabled ||
        props.volume === 0
      ) {
        audio.current.muted = true;
      } else {
        audio.current.muted = false;
      }
      audio.current.autoplay = true;
    }
  };

  return <audio ref={audio} {...props} playsinline />;
};

export default Audio;
