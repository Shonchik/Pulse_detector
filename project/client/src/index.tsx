import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app.component';

const root = createRoot(document.getElementById('root') as HTMLElement);
const node = <App />;

root.render(node);
