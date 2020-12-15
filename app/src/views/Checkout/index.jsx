import React, { useEffect } from 'react';

import styles from './Checkout.module.css';

import ChoosePaymentMethod from './ChoosePaymentMethod';
import { useApiRoute } from '../../hooks/queries';
import { formatPageTitle } from '../../utils/stringFormats';
import {
  Paper,
  LoadingSpinner,
  IgContainer,
} from '../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('checkout'));
  }, []);

  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper}>
        <ChoosePaymentMethod response={response.total} />
      </Paper>
    </IgContainer>
  );
}
