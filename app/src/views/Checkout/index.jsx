import React from 'react';

import { Container } from '../../components/MUI';
import styles from './Checkout.module.css';
import { useTranslation } from 'react-i18next';

import Review from './Review';
import Stepper from './Stepper';
import { useState } from 'react';
import ChoosePaymentMethod from './ChoosePaymentMethod';
import { useFormInput } from '../../hooks/forms';

export default function Checkout() {
  const { t } = useTranslation();
  const [next, setNext] = useState(false);
  const paymentMethod = useFormInput();
  const steps = [
    {
      label: t('payment_method'),
      content: <ChoosePaymentMethod paymentMethod={paymentMethod} />,
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
        showButtons={true}
      />
    </Container>
  );
}
