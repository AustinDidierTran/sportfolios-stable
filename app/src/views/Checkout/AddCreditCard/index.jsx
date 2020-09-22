import React, { useEffect, useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';

import { Button } from '../../../components/MUI';
import api from '../../../actions/api';
import { useFormInput } from '../../../hooks/forms';
import { TextField } from '@material-ui/core';
import styles from './AddCreditCard.module.css';
import CardSection from '../../../utils/stripe/Payment/CardSection';

export async function getCustomer() {
  const { data } = await api('/api/stripe/getCustomer');
  return data;
}

export async function createPaymentMethod(paymentMethodParams) {
  const res = await api('/api/stripe/paymentMethod', {
    method: 'POST',
    body: JSON.stringify(paymentMethodParams),
  });
  return res.data;
}

export async function attachPaymentMethod(attachPaymentMethodParams) {
  const res = await api('/api/stripe/attachPaymentMethod', {
    method: 'POST',
    body: JSON.stringify(attachPaymentMethodParams),
  });
  return res.data;
}

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const name = useFormInput('');
  const { setNext } = props;
  const [customer, setCustomer] = useState({});

  const handleSubmit = async event => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const { token } = await stripe.createToken(
      elements.getElement(CardElement),
    );

    const { address, email, phone } = customer.informations;
    const paymentMethodParams = {
      payment_method: {
        type: 'card',
        card: { token: token.id },
        billing_details: {
          address: address,
          email: email,
          name: name.value,
          phone: phone,
        },
        metadata: {},
      },
    };
    const paymentMethodId = await createPaymentMethod(
      paymentMethodParams,
    );
    const attachPaymentMethodParams = {
      payment_method_id: paymentMethodId,
      customer,
    };
    const customerAttached = await attachPaymentMethod(
      attachPaymentMethodParams,
    );
    /* eslint-disable-next-line */
    console.log('Customer Attached', customerAttached);
    setNext(true);
  };

  const fetchCustomer = async () => {
    const newCustomer = await getCustomer();
    const paymentMethod =
      newCustomer.informations.invoice_settings
        .default_payment_method;
    if (paymentMethod) {
      setNext(true);
    }
    setCustomer(newCustomer);
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.main}>
        <CardSection className={styles.card} />
        <div className={styles.name}>
          <TextField {...name.inputProps} placeholder="Name" />
        </div>
        <Button
          disabled={!stripe}
          className={styles.button}
          onClick={handleSubmit}
        >
          Add credit card
        </Button>
      </div>
    </form>
  );
}
