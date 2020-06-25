import React, { useState, useEffect, useContext } from 'react';

import styles from './Cart.module.css';
import { Container, Button } from '../../components/MUI';
import Item from './Item';
import { Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';

export default function Shop() {
  const [items, setItems] = useState([]);
  const {
    state: { cart, userInfo },
  } = useContext(Store);
  const id = userInfo.user_id;

  const onCheckout = () => {
    goTo(ROUTES.checkout, { id });
  };

  useEffect(() => {
    setItems(cart);
  }, [cart]);

  return (
    <Container className={styles.items}>
      <div className={styles.view}>
        <div className={styles.title}>CART</div>
        <div className={styles.content}>
          {items.map(item => (
            <Item
              name={item.label}
              price={item.amount / 100}
              photoUrl={item.photo_url}
              description={item.description}
              stripe_price_id={item.stripe_price_id}
              entity_id={item.entity_id}
            />
          ))}
        </div>

        <Button onClick={onCheckout} className={styles.button}>
          CHECKOUT
        </Button>
      </div>
    </Container>
  );
}
