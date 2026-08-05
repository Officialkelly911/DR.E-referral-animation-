import { createRoot } from 'react-dom/client';

import { Scene5PreviewApp } from './components/scene5/Scene5PreviewApp';
// Register the automation + QA APIs on window for Playwright access.
import './components/scene5/scene5Actions';
import './components/scene5/scene5InteractionQA';

import './index.css';

createRoot(document.getElementById('root')!).render(<Scene5PreviewApp />);
