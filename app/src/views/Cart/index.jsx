import React, { useState, useEffect, useContext } from 'react';

import styles from './Cart.module.css';
import { Container, Button } from '../../components/MUI';
import CustomCard from '../../components/Custom/Card';
import { Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import api from '../../actions/api';

export default function Cart() {
  const [items, setItems] = useState([]);
  const {
    state: {
      userInfo: { user_id: id },
    },
  } = useContext(Store);

  const onCheckout = () => {
    goTo(ROUTES.checkout, { id });
  };

  const getCartItems = async () => {
    const { data: cartItems } = await api('/api/shop/getCartItems');
    return cartItems;
  };

  const fetchCartItems = async () => {
    const newCart = await getCartItems();
    setItems(newCart.length ? newCart : []);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <Container className={styles.items}>
      <div className={styles.view}>
        <div className={styles.title}>CART</div>
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

        <Button onClick={onCheckout} className={styles.button}>
          CHECKOUT
        </Button>
      </div>
    </Container>
  );
}
