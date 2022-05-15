import {
  DetailedHTMLProps,
  FC,
  useEffect,
  useRef,
  useState,
  VideoHTMLAttributes,
} from 'react';
import styles from './video-preview.module.css';
import { uploadPicture } from '../../../../../api/api';

type VideoPreviewAttrs = DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>;

type VideoPreviewProps = {
  frameUploadEnabled: boolean;
  srcObject: MediaStream | undefined;
  sessionId: number;
};

type VideoPreviewAttrsAndProps = VideoPreviewAttrs & VideoPreviewProps;

const DELAY_BETWEEN_FRAMES = 100;

export const VideoPreview: FC<VideoPreviewAttrsAndProps> = ({ ...attrs }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const className = `${attrs.className || ''} ${styles.videoPreview}`;
  const [timerId, setTimerId] = useState<NodeJS.Timer>();

  useEffect(() => {
    if (attrs.srcObject && videoRef.current) {
      videoRef.current.srcObject = attrs.srcObject;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
    }
  }, [attrs.srcObject]);

  useEffect(() => {
    if (attrs.srcObject && attrs.frameUploadEnabled) {
      const id = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          const canvasContext = canvasRef.current.getContext('2d');
          if (canvasContext) {
            canvasContext.drawImage(videoRef.current, 0, 0);
            const jpegUrl = canvasRef.current
              ?.toDataURL('image/jpeg')
              .split(';base64,')[1];
            if (jpegUrl) {
              uploadPicture(jpegUrl, attrs.sessionId);
            }
          }
        }
      }, DELAY_BETWEEN_FRAMES);
      setTimerId(id);
    }
  }, [attrs.srcObject, attrs.frameUploadEnabled]);

  useEffect(() => {
    if (!attrs.frameUploadEnabled && timerId) {
      console.log('disabling upload...');
      clearTimeout(timerId);
      setTimerId(undefined);
      console.log('upload disabled!');
    }
  }, [attrs.frameUploadEnabled]);

  return (
    <div className={className}>
      <video ref={videoRef} autoPlay>
        {/*<source src={attrs.src} type="video/mp4" />*/}
        Your browser does not support HTML video.
      </video>
      <canvas ref={canvasRef} className={styles.canvasElem}></canvas>
    </div>
  );
};
