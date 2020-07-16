import React, { useState, useEffect, useContext } from 'react';

import styles from './Cart.module.css';
import api from '../../actions/api';

import { Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';

import { Paper, Button } from '../../components/Custom';

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
    <Paper>
      <div className={styles.items}>
        {items.map(item => {
          return (
            <CustomCard
              items={{ ...item, setItems }}
              type={CARD_TYPE_ENUM.CART}
              className={styles.card}
            />
          );
        })}
      </div>

      {items.length ? (
        <Button
          size="small"
          variant="contained"
          className={styles.button}
          endIcon="Check"
          onClick={onCheckout}
        >
          {t('checkout')}
        </Button>
      ) : (
        <></>
      )}
    </Paper>
  );
}
