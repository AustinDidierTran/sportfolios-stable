import React, { useState, useEffect } from 'react';

import styles from './Cart.module.css';
import api from '../../actions/api';

import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { useApiRoute } from '../../hooks/queries';
import { formatPrice } from '../../utils/stringFormats';

import {
  Container,
  Button,
  MessageAndButton,
  Card,
  ContainerBottomFixed,
} from '../../components/Custom';
import { Typography } from '../../components/MUI';

const getCartItems = async () => {
  const { data: cartItems } = await api(
    '/api/shop/getCartItemsOrdered',
  );
  return cartItems;
};

export default function Cart() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');

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

  if (isLoading) {
    return (
      <Container className={styles.items}>
        <CircularProgress />
      </Container>
    );
  }

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
          <Typography variant="h5">
            {`Total: ${formatPrice(response)}`}
          </Typography>
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
