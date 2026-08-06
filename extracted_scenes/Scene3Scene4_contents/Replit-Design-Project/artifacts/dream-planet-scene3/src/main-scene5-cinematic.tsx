import { createRoot } from 'react-dom/client';

import { Scene5CinematicApp } from './components/scene5/Scene5CinematicApp';
// Register automation + QA APIs on window.
import './components/scene5/scene5Actions';
import './components/scene5/scene5InteractionQA';

import './index.css';

createRoot(document.getElementById('root')!).render(<Scene5CinematicApp />);
