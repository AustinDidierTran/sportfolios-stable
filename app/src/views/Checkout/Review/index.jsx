import React, { useState, useEffect, useContext } from 'react';

import styles from './Review.module.css';
import {
  Container,
  Button,
  Typography,
} from '../../../components/MUI';
import Item from './Item';
import { Store, ACTION_ENUM } from '../../../Store';
import { goTo } from '../../../actions/goTo';
import api from '../../../actions/api';

const INVOICE_STATUS_ENUM = {
  DRAFT: 'draft',
  DELETED: 'deleted',
  OPEN: 'open',
  PAID: 'paid',
  UNCOLLECTIBLE: 'uncollectible',
  VOID: 'void',
};

const createInvoiceItem = async price => {
  const res = await api('/api/stripe/createInvoiceItem', {
    method: 'POST',
    body: JSON.stringify({ price: price }),
  });
  const invoiceItem = res.data;
  return invoiceItem;
};

const createInvoice = async () => {
  const invoiceParams = {
    invoice: {
      auto_advance: 'false',
      collection_method: 'charge_automatically',
      description: 'TESTING INVOICE 123',
      metadata: {},
    },
  };
  const res = await api('/api/stripe/createInvoice', {
    method: 'POST',
    body: JSON.stringify(invoiceParams),
  });
  const invoice = res.data;
  return invoice;
};

const finalizeInvoice = async invoiceId => {
  const res = await api('/api/stripe/finalizeInvoice', {
    method: 'POST',
    body: JSON.stringify({ invoice_id: invoiceId }),
  });
  const invoice = res.data;
  return invoice;
};

const payInvoice = async invoiceId => {
  const res = await api('/api/stripe/payInvoice', {
    method: 'POST',
    body: JSON.stringify({ invoice_id: invoiceId }),
  });
  const invoice = res.data;
  return invoice;
};

const deleteCartItems = async () => {
  const res = await api('/api/shop/removeCartItems', {
    method: 'POST',
  });
  const cart = res.data;
  return cart;
};

export default function Review() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const onCheckout = () => {
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: [],
    });
    goTo('/');
  };

  const onCompleteOrder = async () => {
    cart.forEach(async item => {
      const res = await createInvoiceItem(item.stripe_price_id);
      const invoiceItem = res.data;
      /* eslint-disable-next-line */
      console.log('Created Invoice Item', invoiceItem);
    });
    const invoice = await createInvoice();
    /* eslint-disable-next-line */
    console.log('Created invoice', invoice.id);
    if (invoice.status == INVOICE_STATUS_ENUM.DRAFT) {
      const invoice2 = await finalizeInvoice(invoice.id);
      if (invoice2.status == INVOICE_STATUS_ENUM.OPEN) {
        const invoice3 = await payInvoice(invoice.id);
        if (invoice3.status == INVOICE_STATUS_ENUM.PAID) {
          /* eslint-disable-next-line */
          console.log('INVOICE IS PAID', invoice3.id);
          const newCart = await deleteCartItems();
          /* eslint-disable-next-line */
          console.log('Updated cart: ', newCart);
        }
      }
    }
    onCheckout();
  };

  useEffect(() => {
    setItems(cart);
    var total = 0;
    cart.forEach(item => (total += item.amount / 100));
    setTotal(total);
  }, [cart]);

  return (
    <Container className={styles.items}>
      <div className={styles.view}>
        <div className={styles.title}>REVIEW AND PAY</div>
        <div className={styles.content}>
          {items.map(item => (
            <Item
              name={item.label}
              price={item.amount / 100}
              photoUrl={item.photo_url}
              description={item.description}
              stripe_price_id={item.stripe_price_id}
              entity_id={item.entity_id}
            />
          ))}
        </div>
        <Typography>{`Total: ${total}`}</Typography>

        <Button onClick={onCompleteOrder} className={styles.button}>
          COMPLETE ORDER (PAY)
        </Button>
      </div>
    </Container>
  );
}
