import React, { useState } from 'react';

import styles from './Stripe.module.css';
import Stepper from '../../../views/Checkout/Stepper';
import ExternalAccountForm from './Form';
import AccountLink from './AccountLink';

export default function Stripe(props) {
  const { id } = props;
  const [next, setNext] = useState(false);

  const steps = [
    {
      label: 'Add personal information',
      content: <AccountLink id={id} setNext={setNext} />,
    },
    {
      label: 'Add bank account',
      content: <ExternalAccountForm setNext={setNext} />,
    },
  ];
  return (
    <div className={styles.main}>
      <Stepper
        steps={steps}
        next={next}
        setNext={setNext}
        showButtons={false}
      />
    </div>
  );
}
