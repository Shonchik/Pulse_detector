import {
  DetailedHTMLProps,
  FC,
  useEffect,
  useRef,
  VideoHTMLAttributes,
} from 'react';
import styles from './video-preview.module.css';
import { uploadPicture } from '../../../../../api/api';

type VideoPreviewAttrs = DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>;

type VideoPreviewProps = {
  srcObject: MediaStream | undefined;
};

type VideoPreviewAttrsAndProps = VideoPreviewAttrs & VideoPreviewProps;

const DELAY_BETWEEN_FRAMES = 100;

export const VideoPreview: FC<VideoPreviewAttrsAndProps> = ({ ...attrs }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const className = `${attrs.className || ''} ${styles.videoPreview}`;

  useEffect(() => {
    if (attrs.srcObject && videoRef.current) {
      videoRef.current.srcObject = attrs.srcObject;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
    }
  }, [attrs.srcObject]);

  useEffect(() => {
    if (attrs.srcObject) {
      setInterval(() => {
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
              uploadPicture(jpegUrl, 0);
            }
          }
        }
      }, DELAY_BETWEEN_FRAMES);
    }
  }, [attrs.srcObject]);

  return (
    <div className={className}>
      <video ref={videoRef} autoPlay {...attrs}>
        {/*<source src={attrs.src} type="video/mp4" />*/}
        Your browser does not support HTML video.
      </video>
      <canvas ref={canvasRef} className={styles.canvasElem}></canvas>
    </div>
  );
};
