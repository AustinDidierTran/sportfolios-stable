import React, { useState, useEffect, useContext } from 'react';

import styles from './Cart.module.css';
import api from '../../actions/api';

import { Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';

import { Container, Button } from '../../components/MUI';

import CustomCard from '../../components/Custom/Card';

const getCartItems = async () => {
  const { data: cartItems } = await api(
    '/api/shop/getCartItemsOrdered',
  );
  return cartItems;
};

export default function Cart() {
  const { t } = useTranslation();
  const {
    state: {
      userInfo: { user_id: id },
    },
  } = useContext(Store);
  const [items, setItems] = useState([]);

  const onCheckout = () => {
    goTo(ROUTES.checkout, { id });
  };

  const fetchItems = async () => {
    const cartGrouped = await getCartItems();
    setItems(cartGrouped);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <Container className={styles.items}>
        <div className={styles.view}>
          <div className={styles.content}>
            {items.map(item => {
              return (
                <CustomCard
                  items={{ ...item, setItems }}
                  type={CARD_TYPE_ENUM.CART}
                />
              );
            })}
          </div>
          <div className={styles.spacer}></div>
        </div>
      </Container>
      {items.length ? (
        <Button onClick={onCheckout} className={styles.button}>
          {t('checkout')}
        </Button>
      ) : null}
    </div>
  );
}
