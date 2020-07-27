import React from 'react';

import { Container } from '../../components/MUI';
import styles from './Checkout.module.css';

import ChoosePaymentMethod from './ChoosePaymentMethod';
import { useFormInput } from '../../hooks/forms';
import { useApiRoute } from '../../hooks/queries';
import { Paper, LoadingSpinner } from '../../components/Custom';

export default function Checkout() {
  const paymentMethod = useFormInput();

  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className={styles.items}>
      <Paper className={styles.paper}>
        <ChoosePaymentMethod
          paymentMethod={paymentMethod}
          response={response}
        />
      </Paper>
    </Container>
  );
}
