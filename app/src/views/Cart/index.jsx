import React, { useState, useEffect, useContext } from 'react';

import styles from './Cart.module.css';
import { Container, Button } from '../../components/MUI';
import CustomCard from '../../components/Custom/Card';
import { Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';

export default function Cart() {
  const [items, setItems] = useState([]);
  const {
    state: { cart, userInfo },
  } = useContext(Store);
  const id = userInfo.user_id;

  const onCheckout = () => {
    goTo(ROUTES.checkout, { id });
  };

  useEffect(() => {
    setItems(
      cart.map(d => ({
        ...d,
        type: 3,
      })),
    );
  }, [cart]);

  return (
    <Container className={styles.items}>
      <div className={styles.view}>
        <div className={styles.title}>CART</div>
        <div className={styles.content}>
          <CustomCard items={items} />
        </div>

        <Button onClick={onCheckout} className={styles.button}>
          CHECKOUT
        </Button>
      </div>
    </Container>
  );
}
