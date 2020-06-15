import React from 'react';
import { Button } from '../../../components/MUI';
import api from '../../../actions/api';

export default function Customer() {
  const createCustomer = async () => {
    const infos = {
      payment_method: {
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 6,
          exp_year: 2021,
          cvc: '314',
        },
        billing_details: {
          address: {
            line1: '270 rue Jill',
            city: 'Magog',
            country: 'CA', //2 letter country code (ISO)
            line2: null,
            postal_code: 'J1X0T5',
            state: 'QC',
          },
          email: 'alexandre@sportfolios.app',
          name: 'Alexandre Lafleur',
          phone: '8193494191',
        },
        metadata: {},
      },
      customer: {
        address: {
          line1: '270 rue Jill',
          city: 'Magog',
          country: 'CA', //2 letter country code (ISO)
          line2: '',
          postal_code: 'J1X0T5',
          state: 'QC',
        },
        description: 'Testing 123',
        email: 'alexandre@sportfolios.app',
        name: 'Alexandre',
        phone: '8193494191',
        shipping: {
          address: {
            line1: '270 rue Jill',
            city: 'Magog',
            country: 'CA', //2 letter country code (ISO)
            line2: '',
            postal_code: 'J1X0T5',
            state: 'QC',
          },
          name: 'Alexandre',
          phone: '8193494191',
        },
        metadata: {},
        // ...customer, payment_method: id
      },
    };

    await api('/api/stripe/createCustomer', {
      method: 'POST',
      body: JSON.stringify({ infos }),
    });
  };

  const createInvoiceItem = async () => {
    const infos = {
      amount: '2000',
      currency: 'cad',
      description: 'Testing INVOICE ITEM 123',
      metadata: {},
    };

    await api('/api/stripe/createInvoiceItem', {
      method: 'POST',
      body: JSON.stringify({ infos }),
    });
  };

  const payInvoice = async () => {
    const infos = {
      auto_advance: 'false',
      collection_method: 'charge_automatically',
      description: 'TESTING INVOICE 123',
      metadata: {},
      //subscription: (use it to pay only a part of )
    };

    await api('/api/stripe/payInvoice', {
      method: 'POST',
      body: JSON.stringify({ infos }),
    });
  };

  return (
    <div>
      <Button onClick={createCustomer}>Customer</Button>
      <Button onClick={createInvoiceItem}>Invoice Item 20$</Button>
      <Button onClick={payInvoice}>Pay invoice</Button>
    </div>
  );
}
