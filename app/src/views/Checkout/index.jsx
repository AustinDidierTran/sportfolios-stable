import React, { useEffect } from 'react';

import { Container } from '../../components/MUI';
import styles from './Checkout.module.css';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PersonnalInformation from './PersonnalInformation';
import PaymentMethod from './PaymentMethod';
import Review from './Review';
import Stepper from './Stepper';
import { useState } from 'react';

const stripePromise = loadStripe(
  'pk_test_qd1ulz9FxZA3aj2OcBfjqqro00G1K5WrTb',
);

export default function Checkout() {
  const [next, setNext] = useState(false);
  const steps = [
    {
      label: 'Personnal information',
      content: <PersonnalInformation setNext={e => setNext(e)} />,
    },
    {
      label: 'Payment Method',
      content: (
        <Elements stripe={stripePromise}>
          <PaymentMethod setNext={e => setNext(e)} />
        </Elements>
      ),
    },
    {
      label: 'Review & Pay',
      content: <Review />,
    },
  ];

  useEffect(() => {});

  return (
    <Container className={styles.items}>
      <Stepper
        steps={steps}
        next={next}
        setNext={e => setNext(e)}
        showButtons={false}
      />
    </Container>
  );
}
