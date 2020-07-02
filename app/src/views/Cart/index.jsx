import React, { useState, useEffect, useContext } from 'react';

import styles from './Cart.module.css';
import { Container, Button } from '../../components/MUI';
import CustomCard from '../../components/Custom/Card';
import { Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import api from '../../actions/api';
import { useTranslation } from 'react-i18next';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems');
  return cartItems;
};

export default function Cart() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const {
    state: {
      userInfo: { user_id: id },
    },
  } = useContext(Store);

  const onCheckout = () => {
    goTo(ROUTES.checkout, { id });
  };

  const setGrouped = cart => {
    const grouped = groupBy(cart, item => item.stripe_price_id);
    const keys = Array.from(grouped.keys());
    const groupedItems = keys.map(key => {
      return {
        ...cart.find(e => e.stripe_price_id == key),
        nbrInCart: grouped.get(key).length,
      };
    });
    setItems(groupedItems);
  };

  const fetchItems = async () => setGrouped(await getCartItems());

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
                  items={{ ...item, setItems: setGrouped }}
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
