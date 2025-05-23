
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

// Ensure React is properly initialized
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <App />
  );
}

// Register service worker for PWA support
registerServiceWorker();
