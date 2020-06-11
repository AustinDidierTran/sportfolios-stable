import React from 'react';

import { Paper, Stepper } from '../../../../../components/Custom';

export default function StripeStepper(props) {
  return (
    <Paper title="Stripe">
      <Stepper {...props} />
    </Paper>
  );
}
