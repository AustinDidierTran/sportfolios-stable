import React, { useState, useEffect } from 'react';

import styles from './Cart.module.css';
import api from '../../actions/api';

import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { useApiRoute } from '../../hooks/queries';
import {
  formatPrice,
  formatPageTitle,
} from '../../utils/stringFormats';

import {
  Button,
  MessageAndButton,
  Card,
  ContainerBottomFixed,
  LoadingSpinner,
  IgContainer,
} from '../../components/Custom';
import DefaultCard from '../../components/MUI/Card';
import { Typography } from '../../components/MUI';

const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems');
  return cartItems;
};

export default function Cart() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');

  useEffect(() => {
    document.title = formatPageTitle('Cart');
  }, []);

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
      <IgContainer>
        <LoadingSpinner />
      </IgContainer>
    );
  }

  if (items.length < 1) {
    return (
      <IgContainer>
        <MessageAndButton
          button={t('home')}
          onClick={() => {
            goTo(ROUTES.home);
          }}
          endIcon="Home"
          message={t('cart_empty_go_shop')}
        ></MessageAndButton>
      </IgContainer>
    );
  }

  return (
    <>
      <IgContainer>
        <div className={styles.cart}>
          {items.map(item => (
            <Card
              items={{ ...item, setItems }}
              type={CARD_TYPE_ENUM.CART}
            />
          ))}
          <DefaultCard className={styles.defaultCard}>
            <Typography variant="h5" className={styles.typo}>
              {`Total: ${formatPrice(response)}`}
            </Typography>
          </DefaultCard>
        </div>
      </IgContainer>

      <ContainerBottomFixed>
        <div className={styles.buttonDiv}>
          <Button
            size="small"
            variant="contained"
            endIcon="Check"
            onClick={onCheckout}
            style={{ margin: 8 }}
            className={styles.button}
          >
            {t('checkout')}
          </Button>
        </div>
      </ContainerBottomFixed>
    </>
  );
}
