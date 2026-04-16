import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import '../style.css';

import { ErrorFallback, Game } from './components';

const container = document.getElementById('container');
if (!container) {
  throw new Error('Container element not found');
}

const root = createRoot(container);

root.render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Game />
  </ErrorBoundary>
);
