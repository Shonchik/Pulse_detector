import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './camera-interaction-layout.module.css';
import { VideoPreview } from './components/video-preview/video-preview.component';
import { VideoButton } from './components/video-button/video-button.component';
import { getUserMedia } from '../../utils/get-user-media';
import { getBpm, newSession } from '../../../api/api';

type CameraInteractionLayoutAttrs = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type CameraInteractionLayoutProps = {
  //
};

type CameraInteractionLayoutAttrsAndProps = CameraInteractionLayoutAttrs &
  CameraInteractionLayoutProps;

const BPM_REFRESH_DELAY = 1000;

export const CameraInteractionLayout: FC<
  CameraInteractionLayoutAttrsAndProps
> = ({ ...attrs }) => {
  const mediaDeviceStream = useRef<MediaStream>();
  const [isButtonDisabled, setButtonDisableState] = useState(false);
  const [isVideoButtonVisible, setVideoButtonVisibility] = useState(true);
  const [bpmValue, setBmpValue] = useState(0);

  useEffect(() => {
    const createSession = async () => {
      await newSession();
    };
    createSession();
  }, []);

  const className = `${attrs.className || ''} ${
    styles.cameraInteractionLayout
  }`;

  const onStart: MouseEventHandler<HTMLButtonElement> = async () => {
    await setButtonDisableState(true);

    const [mediaStream, mediaStreamError] = await getUserMedia({ video: true });

    if (mediaStreamError !== undefined || mediaStream === undefined) {
      console.log('mediaStreamError:', mediaStreamError);

      setVideoButtonVisibility(false);

      setTimeout(() => {
        setButtonDisableState(false);
        setVideoButtonVisibility(true);
      }, 500);

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

    // well... this is sucks... TODO: fix later (or not)
    setTimeout(() => {
      setButtonDisableState(false);
    }, 2500);
  };

  useEffect(() => {
    setInterval(async () => {
      const bpm = await getBpm(0);
      setBmpValue(bpm);
    }, BPM_REFRESH_DELAY);
  }, []);

  return (
    <div {...attrs} className={className}>
      <div className={styles.interactionSection}>
        <VideoPreview srcObject={mediaDeviceStream.current} />

        <div className={styles.interactionSection__bpm}>{bpmValue} bpm</div>

        <div>
          {isVideoButtonVisible === true ? (
            <VideoButton
              className={styles.interactionSection__button}
              onStart={onStart}
              onStop={onStop}
              disabled={isButtonDisabled}
            />
          ) : (
            'Нужен досуп к камере!'
          )}
        </div>
      </div>
    </div>
  );
};
