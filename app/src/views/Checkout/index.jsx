import React, { useEffect } from 'react';

import { Container } from '../../components/MUI';
import styles from './Checkout.module.css';

import ChoosePaymentMethod from './ChoosePaymentMethod';
import { useFormInput } from '../../hooks/forms';
import { useApiRoute } from '../../hooks/queries';
import { formatPageTitle } from '../../utils/stringFormats';
import { Paper, LoadingSpinner } from '../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();
  const paymentMethod = useFormInput();

  useEffect(() => {
    document.title = formatPageTitle(t('checkout'));
  }, []);

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
