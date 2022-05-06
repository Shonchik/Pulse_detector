import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  MouseEventHandler,
  useRef,
  useState,
} from 'react';
import styles from './camera-interaction-layout.module.css';
import { VideoPreview } from './components/video-preview/video-preview.component';
import { VideoButton } from './components/video-button/video-button.component';
import { getUserMedia } from '../../utils/get-user-media';

type CameraInteractionLayoutAttrs = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type CameraInteractionLayoutProps = {
  //
};

type CameraInteractionLayoutAttrsAndProps = CameraInteractionLayoutAttrs &
  CameraInteractionLayoutProps;

export const CameraInteractionLayout: FC<
  CameraInteractionLayoutAttrsAndProps
> = ({ ...attrs }) => {
  const mediaDeviceStream = useRef<MediaStream>();
  const [isButtonDisabled, setButtonDisableState] = useState(false);

  const className = `${attrs.className || ''} ${
    styles.cameraInteractionLayout
  }`;

  const onStart: MouseEventHandler<HTMLButtonElement> = async () => {
    await setButtonDisableState(true);

    const [mediaStream, mediaStreamError] = await getUserMedia({ video: true });

    if (mediaStreamError !== undefined || mediaStream === undefined) {
      console.log('mediaStreamError:', mediaStreamError);

      return;
    }

    mediaDeviceStream.current = mediaStream;
    console.log(mediaStream);

    await setButtonDisableState(false);
  };

  const onStop: MouseEventHandler<HTMLButtonElement> = () => {
    setButtonDisableState(true);

    if (mediaDeviceStream.current !== undefined) {
      mediaDeviceStream.current.getTracks().forEach((mediaTrack) => {
        mediaTrack.stop();
      });
    }

    // well... this is sucks... TODO: fix later (of not)
    setTimeout(() => {
      setButtonDisableState(false);
    }, 2500);
  };
  const bpmValue = 0;

  return (
    <div {...attrs} className={className}>
      <div className={styles.interactionSection}>
        <VideoPreview />

        <div className={styles.interactionSection__bpm}>{bpmValue} bpm</div>

        <div>
          {`${isButtonDisabled}`}
          <VideoButton
            className={styles.interactionSection__button}
            onStart={onStart}
            onStop={onStop}
            disabled={isButtonDisabled}
          />
        </div>
      </div>
    </div>
  );
};
