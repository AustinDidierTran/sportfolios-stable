import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import styles from './CardSection.module.css';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

function CardSection() {
  return (
    <div className={styles.card}>
      <CardElement
        className={styles.StripeElement}
        options={CARD_ELEMENT_OPTIONS}
      />
    </div>
  );
}

export default CardSection;
