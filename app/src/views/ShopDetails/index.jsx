import React, { useState } from 'react';

import styles from './ShopDetails.module.css';
import { useTranslation } from 'react-i18next';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';

import { Store, ACTION_ENUM } from '../../Store';
import api from '../../actions/api';
import { useFormInput } from '../../hooks/forms';
import { formatRoute } from '../../actions/goTo';
import { Typography, TextField } from '../../components/MUI';
import { Button, Paper } from '../../components/Custom';
import { useEffect } from 'react';

const addCartItem = async params => {
  const { data: newCart = [] } = await api('/api/shop/addCartItem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return newCart;
};

const removeAllInstancesFromCart = async stripePriceId => {
  await api(
    formatRoute('/api/shop/removeAllInstancesFromCart', null, {
      stripe_price_id: stripePriceId,
    }),
    {
      method: 'DELETE',
    },
  );
  return getCartItems();
};

const removeCartItemInstance = async cartInstanceId => {
  await api(
    formatRoute('/api/shop/removeCartItemInstance', null, {
      cartInstanceId,
    }),
    {
      method: 'DELETE',
    },
  );

  return getCartItems();
};

const getCartItems = async () => {
  const { data: cartItems } = await api(
    '/api/shop/getCartItemsOrdered',
  );
  return cartItems;
};

const updateCartItems = async params => {
  await api('/api/shop/updateCartItems', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return getCartItems();
};

export default function ShopDetails() {
  const { t } = useTranslation();
  const { stripePriceId } = useParams();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);
  const [item, setItem] = useState({});
  const [cart, setCart] = useState([]);
  const [displayed, setDisplayed] = useState(true);
  const [deletedIds, setDeletedIds] = useState([]);
  const amount = useFormInput(0);
  const { label: name, amount: price, photoUrl, description } = item;

  const dispatchCart = newCart => {
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: newCart,
    });
  };

  const handleClick = async () => {
    if (amount.value <= 0) {
      await addItem();
    } else {
      await removeAllItems();
    }
  };

  const addItem = async () => {
    const newCart = await addCartItem({
      stripePriceId,
      metadata: { buyer_entity_id: userInfo.persons[0].entity_id },
    });
    setCart(newCart);
    dispatchCart(newCart);
    amount.setValue(oldValue => oldValue + 1);
    setDisplayed(false);
  };

  const removeItem = async () => {
    const itemToDelete = cart.find(
      item =>
        item.stripePriceId == stripePriceId &&
        !deletedIds.includes(item.id),
    );
    const newCart = await removeCartItemInstance(itemToDelete.id);
    setCart(newCart);
    dispatchCart(newCart);
    setDeletedIds([...deletedIds, itemToDelete.id]);
    if (amount.value == 1) {
      setDisplayed(true);
    }
    amount.setValue(oldValue => Math.max(0, oldValue - 1));
  };

  const removeAllItems = async () => {
    const newCart = await removeAllInstancesFromCart(stripePriceId);
    setCart(newCart);
    dispatchCart(newCart);
    amount.setValue(0);
    setDisplayed(true);
  };

  const onNbBlur = async e => {
    const newNbInCart = e.target.value;
    const newCart = await updateCartItems({
      stripePriceId: stripePriceId,
      nbInCart: newNbInCart,
      metadata: { buyer_entity_id: userInfo.persons[0].entity_id },
    });
    setCart(newCart);
    dispatchCart(newCart);
  };

  const fetchItem = async () => {
    const { data = [] } = await api(
      formatRoute('/api/shop/getItem', null, { id: stripePriceId }),
    );
    setItem(data && data[0]);
  };

  useEffect(() => {
    fetchItem();
  }, [stripePriceId]);

  return (
    <Paper>
      <CardMedia className={styles.media} image={photoUrl} />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="h5" className={styles.price}>
          {price / 100}
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          component="p"
          className={styles.description}
        >
          {description}
        </Typography>
        {!displayed ? (
          <div className={styles.cartButton}>
            <Button
              size="small"
              color="default"
              endIcon="RemoveShoppingCart"
              onClick={handleClick}
              className={styles.cart}
            >
              {t('added_to_cart')}
            </Button>
            <div className={styles.cartButtonChildren}>
              <button
                onClick={removeItem}
                className={styles.cartButtonChildren}
              >
                -
              </button>
            </div>
            <div className={styles.cartButtonChildren}>
              <TextField
                {...amount.inputProps}
                onBlur={onNbBlur}
                inputProps={{
                  min: 0,
                  style: { textAlign: 'center' },
                }}
              />
            </div>
            <div className={styles.cartButtonChildren}>
              <button
                onClick={addItem}
                className={styles.cartButtonChildren}
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <Button
            size="small"
            color="primary"
            endIcon="AddShoppingCart"
            onClick={handleClick}
            className={styles.cart}
          >
            {t('add_to_cart')}
          </Button>
        )}
      </CardContent>
    </Paper>
  );
}
