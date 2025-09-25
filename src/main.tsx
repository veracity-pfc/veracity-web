import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LogtoProvider } from '@logto/react';
import App from './App';
import { env } from './env';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LogtoProvider
      config={{
        endpoint: env.logtoEndpoint,
        appId: env.logtoAppId,
        resources: [env.logtoResource], 
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LogtoProvider>
  </React.StrictMode>
);
