import { DetailedHTMLProps, HTMLAttributes, FC } from 'react';
import styles from './full-screen-overlay.module.css';

type FullScreenOverlayAttrs = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type FullScreenOverlayProps = {
  //
};

type FullScreenOverlayAttrsAndProps = FullScreenOverlayAttrs &
  FullScreenOverlayProps;

export const FullScreenOverlay: FC<FullScreenOverlayAttrsAndProps> = ({
  children,
  ...attrs
}) => {
  const className = `${attrs.className || ''} ${styles.fullScreenOverlay}`;

  return (
    <div {...attrs} className={className}>
      {children}
    </div>
  );
};
