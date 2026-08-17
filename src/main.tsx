
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const token = localStorage.getItem('sessionId');
  if (token && resource.toString().startsWith('/api')) {
    config = config || {};
    if (config.headers instanceof Headers) {
      config.headers.set('Authorization', 'Bearer ' + token);
    } else {
      config.headers = { ...config.headers, 'Authorization': 'Bearer ' + token };
    }
  }
  return originalFetch(resource, config);
};
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
