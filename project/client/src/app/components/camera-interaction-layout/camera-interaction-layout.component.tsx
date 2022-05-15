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
import { getBpm, newSession, stopSession } from '../../../api/api';

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
  const [bpmValue, setBmpValue] = useState<string>('');
  const [sessionId, setSessionId] = useState<number>(-1);
  const [bpmTimerId, setBmpTimerId] = useState<NodeJS.Timer>();
  const [isUploadEnabled, setIsUploadEnabled] = useState<boolean>(false);

  const createSession = async () => {
    const id = await newSession();
    console.log(id);
    return id;
  };

  const stopCurrentSession = async () => {
    if (sessionId !== -1) {
      await stopSession(sessionId);
      setSessionId(-1);
    }
  };

  const setBpmUpdate = (id: number) => {
    const timerId = setInterval(async () => {
      const bpm = await getBpm(id);
      setBmpValue(bpm);
    }, BPM_REFRESH_DELAY);

    setBmpTimerId(timerId);
  };

  const stopBpmUpdate = () => {
    if (bpmTimerId) {
      clearInterval(bpmTimerId);
    }
    setBmpValue('');
  };

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

    const id = await createSession();
    setSessionId(id);
    setBpmUpdate(id);

    setIsUploadEnabled(true);
    console.log(mediaStream);

    setButtonDisableState(false);
  };

  const onStop: MouseEventHandler<HTMLButtonElement> = () => {
    setButtonDisableState(true);
    setIsUploadEnabled(false);
    stopBpmUpdate();
    stopCurrentSession();

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

  return (
    <div {...attrs} className={className}>
      <div className={styles.interactionSection}>
        <VideoPreview
          srcObject={mediaDeviceStream.current}
          sessionId={sessionId}
          frameUploadEnabled={isUploadEnabled}
        />

        <div className={styles.interactionSection__bpm}>{bpmValue}</div>

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
