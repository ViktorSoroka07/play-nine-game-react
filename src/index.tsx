import { createRoot } from 'react-dom/client';
import '../style.css';

import { ErrorBoundary, Game } from './components';

const container = document.getElementById('container');
if (!container) {
  throw new Error('Container element not found');
}

const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <Game />
  </ErrorBoundary>
);
