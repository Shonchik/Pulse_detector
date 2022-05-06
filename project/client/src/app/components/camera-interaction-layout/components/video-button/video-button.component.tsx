import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
} from 'react';
import styles from './video-button.module.css';
import { useToggle } from '../../../../hooks/use-toggle.hook';

type VideoButtonAttrs = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type VideoButtonProps = {
  onStart?: MouseEventHandler<HTMLButtonElement>;
  onStop?: MouseEventHandler<HTMLButtonElement>;
};

type VideoButtonAttrsAndProps = VideoButtonAttrs & VideoButtonProps;

export const VideoButton: FC<VideoButtonAttrsAndProps> = ({
  onStart,
  onStop,
  ...attrs
}) => {
  const [isVideoStarted, setVideoStartState] = useToggle();

  const className = `${attrs.className} ${styles.button}`;
  const type: ButtonHTMLAttributes<HTMLButtonElement>['type'] =
    attrs.type || 'button';

  const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    console.log('isVideoStarted:', isVideoStarted);
    setVideoStartState();

    if (onStart !== undefined && isVideoStarted === false) {
      onStart(event);
    }

    if (onStop !== undefined && isVideoStarted === true) {
      onStop(event);
    }

    if (attrs.onClick !== undefined) {
      attrs.onClick(event);
    }
  };

  const text = isVideoStarted === false ? 'Старт' : 'Стоп';

  return (
    <button {...attrs} className={className} type={type} onClick={onClick}>
      {text}
    </button>
  );
};
