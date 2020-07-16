import React, { useEffect, useState } from 'react';
import api from '../../../actions/api';
import { Button } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function ChoosePaymentMethod() {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);

  const getPaymentMethods = async () => {
    const { data } = await api('/api/stripe/paymentMethods');
    setPaymentMethods(data);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  if (!paymentMethods.length) {
    return (
      <>
        <p>{t('no_payment_methods')}</p>
        <Button onClick={() => goTo(ROUTES.addPaymentMethod)}>
          {t('add_payment_method')}
        </Button>
      </>
    );
  }

  return (
    <>
      {JSON.stringify(paymentMethods)}
      <Button onClick={() => goTo(ROUTES.addPaymentMethod)}>
        Add payment method
      </Button>
    </>
  );
}
