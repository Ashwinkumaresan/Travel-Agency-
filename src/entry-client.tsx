import './lib/fetch-interceptor.ts';
import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
const app = (
    <HashRouter>
      <App />
    </HashRouter>
);

// If the root has SSR content, hydrate. Otherwise, do a full client render.
if (rootElement.innerHTML.trim().length > 0) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
