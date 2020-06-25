import React from 'react';
import { Paper, Stepper } from '../../../components/Custom';

export default function CheckoutStepper(props) {
  return (
    <Paper title="Checkout">
      <Stepper {...props} />
    </Paper>
  );
}
