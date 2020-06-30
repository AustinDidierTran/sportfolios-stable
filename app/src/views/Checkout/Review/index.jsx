import React, { useState, useEffect, useContext } from 'react';

import styles from './Review.module.css';
import {
  Container,
  Button,
  Typography,
} from '../../../components/MUI';
import CustomCard from '../../../components/Custom/Card';
import { Store, ACTION_ENUM } from '../../../Store';
import { formatRoute } from '../../../actions/goTo';
import api from '../../../actions/api';
import {
  INVOICE_STATUS_ENUM,
  CARD_TYPE_ENUM,
} from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';

const createInvoiceItem = async price => {
  const { data: invoiceItem } = await api(
    '/api/stripe/createInvoiceItem',
    {
      method: 'POST',
      body: JSON.stringify({ price }),
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
  const { data: newCart } = await api('/api/shop/removeCartItems', {
    method: 'DELETE',
  });
  return newCart;
};

const getReceipt = async (chargeId, invoiceId) => {
  const { data: receiptUrl } = await api(
    formatRoute('/api/stripe/getReceipt', null, {
      charge_id: chargeId,
      invoice_id: invoiceId,
    }),
  );
  return receiptUrl;
};

const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems');
  return cartItems;
};

export default function Review() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [receiptUrl, setReceiptUrl] = useState('');
  const { dispatch } = useContext(Store);

  const onCheckout = () => {
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: [],
    });
  };

  const onCompleteOrder = async () => {
    await items.forEach(async item => {
      const { data: invoiceItem } = await createInvoiceItem(
        item.stripe_price_id,
      );
      /* eslint-disable-next-line */
      console.log('Created Invoice Item', invoiceItem);
    });
    const invoice = await createInvoice();
    /* eslint-disable-next-line */
    console.log('Created invoice', invoice);

    if (invoice.status == INVOICE_STATUS_ENUM.DRAFT) {
      const finalizedInvoice = await finalizeInvoice(invoice.id);
      if (finalizedInvoice.status == INVOICE_STATUS_ENUM.OPEN) {
        const paidInvoice = await payInvoice(invoice.id);
        if (paidInvoice.status == INVOICE_STATUS_ENUM.PAID) {
          /* eslint-disable-next-line */
          console.log('INVOICE IS PAID', paidInvoice);

          const receiptUrl = await getReceipt(paidInvoice.charge);
          setReceiptUrl(receiptUrl);
          /* eslint-disable-next-line */
          console.log('Receipt url: ', receiptUrl);

          const newCart = await deleteCartItems();
          /* eslint-disable-next-line */
          console.log('Updated cart: ', newCart);
        }
      }
    }
    onCheckout();
  };

  const onReceiptUrl = async () => {
    window.location.href = receiptUrl;
  };

  const fetchCartItems = async () => {
    const newCart = await getCartItems();
    setItems(newCart);
  };

  const getTotal = () => {
    const total = items.reduce(
      (prevTotal, item => (prevTotal += item.amount / 100)),
      0,
    );
    setTotal(total);
  };

  useEffect(() => {
    fetchCartItems();
    getTotal();
  }, []);

  if (receiptUrl) {
    return <Button onClick={onReceiptUrl}>{t('see_receipt')}</Button>;
  }

  return (
    <Container className={styles.items}>
      <div className={styles.view}>
        <div className={styles.title}>{t('review')}</div>
        <div className={styles.content}>
          {items.map(item => {
            return (
              <CustomCard
                items={{ ...item, setItems }}
                type={CARD_TYPE_ENUM.INVOICE}
              />
            );
          })}
        </div>
        <Typography>{`Total: ${total}`}</Typography>

        <Button onClick={onCompleteOrder} className={styles.button}>
          {t('complete_order')}
        </Button>
      </div>
    </Container>
  );
}
