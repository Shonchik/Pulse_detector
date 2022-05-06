import '../styles/main.css';
import { FC } from 'react';
import styles from './app.module.css';
import { FullScreenOverlay } from './components/full-screen-overlay/full-screen-overlay.component';
import { CameraInteractionLayout } from './components/camera-interaction-layout/camera-interaction-layout.component';

export const App: FC = () => {
  return (
    <div className={styles.app}>
      {navigator.mediaDevices === undefined ? (
        <FullScreenOverlay>
          Приложение не поддерживает &quot;mediaDevices&quot; API.
        </FullScreenOverlay>
      ) : (
        <CameraInteractionLayout />
      )}
    </div>
  );
};
