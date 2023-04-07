

import { createRoot } from 'react-dom';
import Root from './Root.client';

const initialCache = new Map();
const root = createRoot(document.getElementById('client'));
root.render(<Root initialCache={initialCache} />);


