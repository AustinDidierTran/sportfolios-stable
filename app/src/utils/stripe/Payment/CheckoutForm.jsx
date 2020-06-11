import React from 'react';
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';

import CardSection from './CardSection';
import { Button } from '../../../components/MUI';
import { useParams } from 'react-router-dom';
import api from '../../../actions/api';
import { useFormInput } from '../../../hooks/forms';
import { TextField } from '@material-ui/core';
import styles from './CheckoutForm.module.css';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const name = useFormInput('');
  const amount = useFormInput();

  const handleSubmit = async event => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const paymentIntent = await api('/api/stripe/paymentIntent', {
      method: 'POST',
      body: JSON.stringify({ id: id, amount: amount.value }),
    });
    console.log('paymentIntent', paymentIntent);
    console.log('clientSecret', paymentIntent.data.client_secret);
    const secret = paymentIntent.data.client_secret;

    const res = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name.value,
        },
      },
    });

    if (res.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(res.error.message);
    } else {
      // The payment has been processed!
      console.log('payment processed');
      if (res.paymentIntent.status === 'succeeded') {
        console.log('res', res);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.main}>
        <div className={styles.textfield}>
          <TextField {...name.inputProps} placeholder="Name" />
        </div>
        <div className={styles.textfield}>
          <TextField {...amount.inputProps} placeholder="Amount" />
        </div>
        <CardSection />
        <Button
          disabled={!stripe}
          className={styles.button}
          onClick={handleSubmit}
        >
          Confirm order
        </Button>
      </div>
    </form>
  );
}
