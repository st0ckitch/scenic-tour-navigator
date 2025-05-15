
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToursProvider } from './contexts/ToursContext.tsx'

createRoot(document.getElementById("root")!).render(
  <ToursProvider>
    <App />
  </ToursProvider>
);
