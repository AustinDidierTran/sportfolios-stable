import React from 'react';

import { Container } from '../../components/MUI';
import styles from './Checkout.module.css';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [next, setNext] = useState(false);
  const steps = [
    {
      label: t('personnal_information'),
      content: <PersonnalInformation setNext={setNext} />,
    },
    {
      label: t('payment_method'),
      content: (
        <Elements stripe={stripePromise}>
          <PaymentMethod setNext={setNext} />
        </Elements>
      ),
    },
    {
      label: t('review'),
      content: <Review />,
    },
  ];

  return (
    <Container className={styles.items}>
      <Stepper
        steps={steps}
        next={next}
        setNext={setNext}
        showButtons={false}
      />
    </Container>
  );
}
