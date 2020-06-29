import React, { useState, useEffect, useContext } from 'react';

import styles from './Review.module.css';
import {
  Container,
  Button,
  Typography,
} from '../../../components/MUI';
import CustomCard from '../../../components/Custom/Card';
import { Store, ACTION_ENUM } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import api from '../../../actions/api';
import { INVOICE_STATUS_ENUM } from '../../../../../common/enums';

const createInvoiceItem = async price => {
  const { data: invoiceItem } = await api(
    '/api/stripe/createInvoiceItem',
    {
      method: 'POST',
      body: JSON.stringify({ price: price }),
    },
  );
  return invoiceItem;
};

const createInvoice = async () => {
  const invoiceParams = {
    invoice: {
      auto_advance: 'false',
      collection_method: 'charge_automatically',
      metadata: {},
    },
  };
  const { data: invoice } = await api('/api/stripe/createInvoice', {
    method: 'POST',
    body: JSON.stringify(invoiceParams),
  });
  return invoice;
};

const finalizeInvoice = async invoiceId => {
  const { data: invoice } = await api('/api/stripe/finalizeInvoice', {
    method: 'POST',
    body: JSON.stringify({ invoice_id: invoiceId }),
  });
  return invoice;
};

const payInvoice = async invoiceId => {
  const { data: invoice } = await api('/api/stripe/payInvoice', {
    method: 'POST',
    body: JSON.stringify({ invoice_id: invoiceId }),
  });
  return invoice;
};

const deleteCartItems = async () => {
  const { data: cart } = await api('/api/shop/removeCartItems', {
    method: 'DELETE',
  });
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
    goTo(ROUTES.home);
  };

  const onCompleteOrder = async () => {
    cart.forEach(async item => {
      const { data: invoiceItem } = await createInvoiceItem(
        item.stripe_price_id,
      );
      /* eslint-disable-next-line */
      console.log('Created Invoice Item', invoiceItem);
    });
    const invoice = await createInvoice();
    /* eslint-disable-next-line */
    console.log('Created invoice', invoice.id);
    if (invoice.status == INVOICE_STATUS_ENUM.DRAFT) {
      const finalizedInvoice = await finalizeInvoice(invoice.id);
      if (finalizedInvoice.status == INVOICE_STATUS_ENUM.OPEN) {
        const paidInvoice = await payInvoice(invoice.id);
        if (paidInvoice.status == INVOICE_STATUS_ENUM.PAID) {
          /* eslint-disable-next-line */
          console.log('INVOICE IS PAID', paidInvoice.id);
          const newCart = await deleteCartItems();
          /* eslint-disable-next-line */
          console.log('Updated cart: ', newCart);
        }
      }
    }
    onCheckout();
  };

  useEffect(() => {
    setItems(
      cart.map(d => ({
        ...d,
        type: 2,
      })),
    );
    let total = 0;
    cart.forEach(item => (total += item.amount / 100));
    setTotal(total);
  }, [cart]);

  return (
    <Container className={styles.items}>
      <div className={styles.view}>
        <div className={styles.title}>REVIEW AND PAY</div>
        <div className={styles.content}>
          <CustomCard items={items} />
        </div>
        <Typography>{`Total: ${total}`}</Typography>

        <Button onClick={onCompleteOrder} className={styles.button}>
          COMPLETE ORDER (PAY)
        </Button>
      </div>
    </Container>
  );
}
