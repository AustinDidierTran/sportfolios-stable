import React from 'react';

import { Container, Typography } from '../../components/MUI';
import styles from './Checkout.module.css';

import ChoosePaymentMethod from './ChoosePaymentMethod';
import { useFormInput } from '../../hooks/forms';
import { useApiRoute } from '../../hooks/queries';
import { formatPrice } from '../../utils/stringFormats';
import { CircularProgress } from '@material-ui/core';
import { Paper } from '../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();
  const paymentMethod = useFormInput();

  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');

  if (isLoading) {
    return (
      <Container className={styles.items}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container className={styles.items}>
      <Paper className={styles.paper}>
        <Typography variant="h5">
          {t('amount_to_pay', { amount: formatPrice(response) })}
        </Typography>
        <ChoosePaymentMethod paymentMethod={paymentMethod} />
      </Paper>
    </Container>
  );
}
