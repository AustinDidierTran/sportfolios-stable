import React from 'react';
import { Button } from '../../../components/MUI';
import api from '../../../actions/api';

// const cart = {
//   items: [item, item, item],
//   subscription: 'fsdfs'
// };

// const item = {
//   id: 'uuid',
//   store_id: 'uuid'
//   label: 'Frisbee',
//   price: 20,
//   invoice_item: {
//     amount: '2000',
//     currency: 'cad',
//     description: 'frisbee',
//     metadata: {},
//   },
// };

const customerParams = {
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
    // ...customer, payment_method: id
  },
};

const paymentMethodParams = {
  payment_method: {
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 5,
      exp_year: 2022,
      cvc: '334',
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
};

const attachPaymentMethodParams = {
  payment_method_id: 'pm_1Gui4vJPddOlmWPIF9v3HDSI',
};

const detachPaymentMethodParams = {
  payment_method_id: 'pm_1Gui4vJPddOlmWPIF9v3HDSI',
};

const invoiceItemParams = {
  invoice_item: {
    amount: '2000',
    currency: 'cad',
    description: 'Testing INVOICE ITEM 123',
    metadata: {},
  },
};

const invoiceParams = {
  invoice: {
    auto_advance: 'false',
    collection_method: 'charge_automatically',
    description: 'TESTING INVOICE 123',
    metadata: {},
    //subscription: (use it to pay only a part of )
  },
};

// const finalizeInvoiceParams = {
//   invoice_id: 'in_1GuPXPJPddOlmWPIMpmZKLyJ',
// };
// const payInvoiceParams = {
//   invoice_id: 'in_1GuPXPJPddOlmWPIMpmZKLyJ',
// };

export default function Customer() {
  const createCustomer = async () => {
    const res = await api('/api/stripe/createCustomer', {
      method: 'POST',
      body: JSON.stringify(customerParams),
    });
    console.log(res);
  };

  const createInvoiceItem = async () => {
    const res = await api('/api/stripe/createInvoiceItem', {
      method: 'POST',
      body: JSON.stringify(invoiceItemParams),
    });
    console.log(res);
  };

  const payInvoice = async () => {
    const res = await api('/api/stripe/payInvoice', {
      method: 'POST',
      body: JSON.stringify(invoiceParams),
    });
    console.log(res);
  };

  const createPaymentMethod = async () => {
    const res = await api('/api/stripe/paymentMethod', {
      method: 'POST',
      body: JSON.stringify(paymentMethodParams),
    });
    console.log(res);
  };

  const attachPaymentMethod = async () => {
    const res = await api('/api/stripe/attachPaymentMethod', {
      method: 'POST',
      body: JSON.stringify(attachPaymentMethodParams),
    });
    console.log(res);
  };

  const detachPaymentMethod = async () => {
    const res = await api('/api/stripe/detachPaymentMethod', {
      method: 'POST',
      body: JSON.stringify(detachPaymentMethodParams),
    });
    console.log(res);
  };

  // const finalizeInvoice = async () => {
  //   const res = await api('/api/stripe/finalizeInvoice', {
  //     method: 'POST',
  //     body: JSON.stringify(finalizeInvoiceParams),
  //   });
  //   console.log(res);
  // };

  // const payInvoice2 = async () => {
  //   const res = await api('/api/stripe/payInvoice2', {
  //     method: 'POST',
  //     body: JSON.stringify(payInvoiceParams),
  //   });
  //   console.log(res);
  // };

  return (
    <div>
      <Button onClick={createCustomer}>Customer</Button>
      <Button onClick={createPaymentMethod}>
        Create Payment Method
      </Button>
      <Button onClick={attachPaymentMethod}>
        Attach Payment Method to customer
      </Button>
      <Button onClick={detachPaymentMethod}>
        Detach Payment Method from customer
      </Button>
      <Button onClick={createInvoiceItem}>Invoice Item 20$</Button>
      <Button onClick={payInvoice}>Pay invoice</Button>
    </div>
  );
}
