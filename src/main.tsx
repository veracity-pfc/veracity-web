import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LogtoProvider } from '@logto/react';
import App from './App';

const endpoint = import.meta.env.VITE_LOGTO_ENDPOINT as string;
const appId = import.meta.env.VITE_LOGTO_APP_ID as string;
const resource = import.meta.env.VITE_LOGTO_RESOURCE as string | undefined;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LogtoProvider
      config={{
        endpoint,
        appId,
        scopes: ['openid', 'profile', 'email'],
        ...(resource ? { resources: [resource] } : {}),
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LogtoProvider>
  </React.StrictMode>
);
