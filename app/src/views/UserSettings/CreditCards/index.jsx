import React, { useEffect, useState } from 'react';
import {
  List,
  LoadingSpinner,
  Button,
} from '../../../components/Custom';
import styles from './CreditCards.module.css';
import { Card } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { LIST_ITEM_ENUM } from '../../../../../common/enums';
import api from '../../../actions/api';
import { goTo, ROUTES } from '../../../actions/goTo';
import moment from 'moment';

export default function CreditCards() {
  const { t } = useTranslation();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const getPaymentMethods = async () => {
    setIsLoading(true);
    const { data } = await api('/api/stripe/paymentMethods');
    const sorted = data.sort(
      (a, b) => moment(b.created_at) - moment(a.created_at),
    );
    const pms = sorted.map(d => ({
      last4: d.last4,
      customerId: d.customer_id,
      createdAt: d.created_at,
      isDefault: d.is_default,
      type: LIST_ITEM_ENUM.CREDIT_CARD,
      key: d.payment_method_id,
      update: getPaymentMethods,
    }));
    setPaymentMethods(pms);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <Card className={styles.card}>
      <List title={t('credit_cards')} items={paymentMethods}></List>
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={() =>
          goTo(ROUTES.addPaymentMethod, null, {
            redirect: ROUTES.userSettings,
          })
        }
        style={{ margin: '8px' }}
      >
        {t('add_credit_card')}
      </Button>
    </Card>
  );
}
