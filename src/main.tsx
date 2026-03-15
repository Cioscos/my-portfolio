import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/i18n';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-bg-primary text-text-secondary">Loading...</div>}>
      <App />
    </Suspense>
  </StrictMode>,
);
