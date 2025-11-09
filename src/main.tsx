import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import App from './App';

const rootEl = document.getElementById('root') as HTMLElement;
createRoot(rootEl).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
