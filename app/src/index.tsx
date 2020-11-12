import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/index';
import { StoreProvider } from './Store';
import App from './views/App/index';

import '../styles/global.css';

main();
function main() {
  if (process.env.NODE_ENV == 'production') {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            /* eslint-disable-next-line */
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            /* eslint-disable-next-line */
            console.log(
              'SW registration failed: ',
              registrationError,
            );
          });
      });
    }
  }

  const app = document.createElement('div');
  document.body.appendChild(app);

  ReactDOM.render(
    <StoreProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </StoreProvider>,
    app,
  );
}
