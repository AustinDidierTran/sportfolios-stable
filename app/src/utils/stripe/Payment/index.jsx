// @noflow

import React from 'react';
import CheckoutForm from './CheckoutForm';
import Customer from './Customer';

const App = () => {
  return (
    <div>
      <Customer />
      <CheckoutForm />
    </div>
  );
};

export default App;
