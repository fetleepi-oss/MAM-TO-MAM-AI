import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import './utils/disguiseService';

// Register service worker for offline-first PWA caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('MAM-to-MAM AI updated in background.');
  },
  onOfflineReady() {
    console.log('MAM-to-MAM AI is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
