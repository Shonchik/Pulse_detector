import { DetailedHTMLProps, FC, VideoHTMLAttributes } from 'react';
import styles from './video-preview.module.css';

type VideoPreviewAttrs = DetailedHTMLProps<
  VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>;

type VideoPreviewProps = {
  //
};

type VideoPreviewAttrsAndProps = VideoPreviewAttrs & VideoPreviewProps;

export const VideoPreview: FC<VideoPreviewAttrsAndProps> = ({ ...attrs }) => {
  const className = `${attrs.className || ''} ${styles.videoPreview}`;

  return (
    <div className={className}>
      <video {...attrs}>
        <source src={attrs.src} type="video/mp4" />
        Your browser does not support HTML video.
      </video>
    </div>
  );
};
