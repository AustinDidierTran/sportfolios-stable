import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../actions/api';
import { Button, RadioGroup } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { checkout } from '../../../utils/stripe';
import styles from './ChoosePaymentMethod.module.css';
import logo from '../../../img/bigLogo.png';

export default function ChoosePaymentMethod(props) {
  const { paymentMethod } = props;
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPaymentMethods = async () => {
    const { data } = await api('/api/stripe/paymentMethods');
    const pms = data.map(d => ({
      display: t('card_ending_with', { last4: d.last4 }),
      value: d.payment_method_id,
      last4: d.last4,
    }));
    setPaymentMethods(pms);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const paymentDisabled = useMemo(
    () => !Boolean(paymentMethod.value),
    [paymentMethod.value],
  );

  const pay = async () => {
    setIsLoading(true);
    const {
      data: {
        invoice: { amount_paid: amountPaid },
        receiptUrl,
      },
      status,
    } = await checkout(paymentMethod.value);

    if (status === 200) {
      goTo(ROUTES.orderProcessed, null, {
        paid: amountPaid,
        last4: paymentMethods.find(
          p => p.value === paymentMethod.value,
        ).last4,
        receiptUrl,
      });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!paymentMethods.length) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={logo} />
        </div>
        <p>{t('no_payment_method')}</p>
        <Button
          style={{ textAlign: 'center' }}
          onClick={() => goTo(ROUTES.addPaymentMethod)}
        >
          {t('add_payment_method')}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 16, textAlign: 'center' }}>
      <RadioGroup
        namespace="paymentMethod"
        options={paymentMethods}
        title={t('select_payment_method')}
        {...paymentMethod.inputProps}
      />
      <br />
      <Button
        style={{ textAlign: 'center' }}
        onClick={() => goTo(ROUTES.addPaymentMethod)}
      >
        {t('add_payment_method')}
      </Button>
      <br />
      <br />
      <Button disabled={paymentDisabled} onClick={pay}>
        Payer
      </Button>
    </div>
  );
}
