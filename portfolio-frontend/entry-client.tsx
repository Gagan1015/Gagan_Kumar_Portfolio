import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import type { DehydratedState } from '@tanstack/react-query';
import './app.css';
import App from './App';

declare global {
  interface Window {
    __REACT_QUERY_STATE__?: unknown;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to hydrate');
}

hydrateRoot(
  rootElement,
  <StrictMode>
    <App dehydratedState={window.__REACT_QUERY_STATE__ as DehydratedState} />
  </StrictMode>
);
