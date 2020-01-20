import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './components/views/App/App';

main();
function main() {
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    app,
  );
}
