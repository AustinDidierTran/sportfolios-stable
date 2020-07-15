import React, { useEffect, useState } from 'react';
import api from '../../../actions/api';
import { Button } from '../../../components/Custom';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function ChoosePaymentMethod(props) {
  const [paymentMethods, setPaymentMethods] = useState([]);

  const getPaymentMethods = async () => {
    const { data } = await api('/api/stripe/paymentMethods');
    setPaymentMethods(data);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  return (
    <>
      {JSON.stringify(paymentMethods)}
      <Button onClick={() => goTo(ROUTES.addPaymentMethod)}>
        Add payment method
      </Button>
    </>
  );
}
