import React from 'react';
import { createRoot } from 'react-dom/client';
import '../style.css';

import { Game } from './components';

const container = document.getElementById('container');
const root = createRoot(container);

root.render(<Game />);
