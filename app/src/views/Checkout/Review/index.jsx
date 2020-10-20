import React, { useState, useEffect, useContext } from 'react';

import styles from './Review.module.css';
import {
  Container,
  Button,
  Typography,
} from '../../../components/MUI';
import CustomCard from '../../../components/Custom/Card';
import { Store, ACTION_ENUM } from '../../../Store';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import {
  checkout,
  clearCart,
  createRefund,
  getCartItems,
} from '../../../utils/stripe';
import { formatPrice } from '../../../utils/stringFormats';

export default function Review() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [invoice, setInvoice] = useState({});
  const [transfers, setTransfers] = useState([]);
  const { dispatch } = useContext(Store);

  const onCheckout = async () => {
    /* eslint-disable-next-line */
    console.log('transfers', transfers);
    await clearCart();
    setItems([]);
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: [],
    });
  };

  const onCompleteOrder = async () => {
    const prices = items.map(item => {
      return { price: item.stripePriceId };
    });
    const data = await checkout(prices);
    const { invoice, receipt, transfers } = data;
    setInvoice(invoice);
    setReceiptUrl(receipt);
    setTransfers(transfers);
    await onCheckout();
  };

  const onReceiptUrl = async () => {
    window.location.href = receiptUrl;
  };

  const onRefund = async () => {
    const refund = await createRefund({
      invoiceId: invoice.id,
      prices: ['price_1H1zYSJPddOlmWPIGM0S0IoN'],
    });
    /* eslint-disable-next-line */
    console.log('refund', refund);
  };

  const fetchCartItems = async () => {
    const newCart = await getCartItems();
    setItems(newCart);
  };

  const getTotal = () => {
    const total = items.reduce(
      (prevTotal, item) => (prevTotal += item.amount),
      0,
    );
    setTotal(total);
  };

  useEffect(() => {
    fetchCartItems();
    getTotal();
  }, []);

  if (receiptUrl) {
    return (
      <div>
        <Button onClick={onReceiptUrl}>{t('see_receipt')}</Button>
        <Button onClick={onRefund}>{t('refund')}</Button>
      </div>
    );
  }
  return (
    <Container className={styles.items}>
      <div className={styles.view}>
        <div className={styles.title}>{t('review')}</div>
        <div className={styles.content}>
          {items.map((item, index) => {
            return (
              <CustomCard
                items={{ ...item, setItems }}
                type={CARD_TYPE_ENUM.INVOICE}
                key={index}
              />
            );
          })}
        </div>
        <Typography>{`Total: ${formatPrice(total)}`}</Typography>

        <Button onClick={onCompleteOrder} className={styles.button}>
          {t('complete_order')}
        </Button>
      </div>
    </Container>
  );
}
