import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import PerformanceOptimizer from './components/SEO/PerformanceOptimizer';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      <PerformanceOptimizer />
    </HelmetProvider>
  </StrictMode>
);