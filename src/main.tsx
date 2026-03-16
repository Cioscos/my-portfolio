import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n/i18n';
import './index.css';
import App from './App';
import Layout from './components/Layout';
import BlogPostPage from './pages/BlogPostPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-bg-primary text-text-secondary">Loading...</div>}>
      <BrowserRouter basename="/my-portfolio/">
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
);
