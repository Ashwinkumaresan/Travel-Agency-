import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// If the root has SSR content, hydrate. Otherwise, do a full client render.
if (rootElement.innerHTML.trim().length > 0) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
