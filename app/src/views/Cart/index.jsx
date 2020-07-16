import React, { useState, useEffect } from 'react';

import styles from './Cart.module.css';
import api from '../../actions/api';

import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';

import {
  Paper,
  Button,
  MessageAndButton,
} from '../../components/Custom';

import CustomCard from '../../components/Custom/Card';

const getCartItems = async () => {
  const { data: cartItems } = await api(
    '/api/shop/getCartItemsOrdered',
  );
  return cartItems;
};

export default function Cart() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  const onCheckout = () => {
    goTo(ROUTES.checkout);
  };

  const fetchItems = async () => {
    const cartGrouped = await getCartItems();
    setItems(cartGrouped);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (items.length < 1) {
    return (
      <MessageAndButton
        button={t('home')}
        onClick={() => {
          goTo(ROUTES.home);
        }}
        endIcon="Home"
        message={t('cart_empty_go_shop')}
      ></MessageAndButton>
    );
  }

  return (
    <Paper>
      <div className={styles.items}>
        {items.map(item => {
          <CustomCard
            items={{ ...item, setItems }}
            type={CARD_TYPE_ENUM.CART}
            className={styles.card}
          />;
        })}
      </div>
      <Button
        size="small"
        variant="contained"
        className={styles.button}
        endIcon="Check"
        onClick={onCheckout}
      >
        {t('checkout')}
      </Button>
    </Paper>
  );
}
