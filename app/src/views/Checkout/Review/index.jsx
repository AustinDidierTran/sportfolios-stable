import React, { useState, useEffect, useContext } from 'react';

import styles from './Review.module.css';
import {
  Container,
  Button,
  Typography,
} from '../../../components/MUI';
import CustomCard from '../../../components/Custom/Card';
import { Store, ACTION_ENUM } from '../../../Store';
import api from '../../../actions/api';
import { CARD_TYPE_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';

const deleteCartItems = async () => {
  const { data: newCart } = await api('/api/shop/clearCart', {
    method: 'DELETE',
  });
  return newCart;
};

const checkout = async prices => {
  const { data: receiptUrl } = await api('/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ prices }),
  });
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

  const onCheckout = async () => {
    await deleteCartItems();
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
    const receipt = await checkout(prices);
    setReceiptUrl(receipt);
    await onCheckout();
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
      (prevTotal, item) => (prevTotal += item.amount / 100),
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
