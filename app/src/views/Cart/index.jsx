import React, { useState, useEffect } from 'react';

import styles from './Cart.module.css';
import api from '../../actions/api';

import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';

import {
  Container,
  Button,
  MessageAndButton,
  Card,
  ContainerBottomFixed,
} from '../../components/Custom';

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
      <Container>
        <MessageAndButton
          button={t('home')}
          onClick={() => {
            goTo(ROUTES.home);
          }}
          endIcon="Home"
          message={t('cart_empty_go_shop')}
        ></MessageAndButton>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.main}>
        <div className={styles.general}>
          {items.map(item => (
            <Card
              items={{ ...item, setItems }}
              type={CARD_TYPE_ENUM.CART}
            />
          ))}
        </div>
      </div>
      <ContainerBottomFixed>
        <Button
          size="small"
          variant="contained"
          endIcon="Check"
          onClick={onCheckout}
        >
          {t('checkout')}
        </Button>
      </ContainerBottomFixed>
    </Container>
  );
}
