import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../actions/api';
import { Button, RadioGroup } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { checkout } from '../../../utils/stripe';

export default function ChoosePaymentMethod(props) {
  const { paymentMethod } = props;
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPaymentMethods = async () => {
    const { data } = await api('/api/stripe/paymentMethods');
    const pms = data.map(d => ({
      display: t('card_ending_with', { last4: d.last4 }),
      value: d.payment_method_id,
    }));
    setPaymentMethods(pms);
    setIsLoading(false);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const paymentDisabled = useMemo(
    () => !Boolean(paymentMethod.value),
    [paymentMethod.value],
  );

  const pay = async () => {
    await checkout(paymentMethod.value);
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
        <p>{t('no_payment_methods')}</p>
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
