
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

console.log('Starting React app initialization...');

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log('Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app rendered successfully');
} else {
  console.error('Root element not found!');
}

// Register service worker for PWA support
registerServiceWorker();
