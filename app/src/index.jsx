import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { StoreProvider } from './Store';

import App from './views/App';

main();
function main() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = "width=device-width,initial-scale=1.0";
  link.href =
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap';
  document.head.appendChild(link);
  document.head.appendChild(meta);
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
