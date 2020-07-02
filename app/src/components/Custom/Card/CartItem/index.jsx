import React from 'react';

import styles from './CartItem.module.css';

import { Typography, TextField } from '../../../MUI';
import { Paper } from '../..';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useContext } from 'react';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { formatRoute } from '../../../../actions/goTo';
import { useState } from 'react';
import { useFormInput } from '../../../../hooks/forms';

const addCartItem = async params => {
  const { data: newCart = [] } = await api('/api/shop/addCartItem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return newCart;
};

const removeCartItemInstance = async cartInstanceId => {
  await api(
    formatRoute('/api/shop/removeCartItemInstance', null, {
      cart_instance_id: cartInstanceId,
    }),
    {
      method: 'DELETE',
    },
  );

  return getCartItems();
};

const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems');
  return cartItems;
};

export default function Item(props) {
  const { dispatch } = useContext(Store);
  const [deletedIds, setDeletedIds] = useState([]);
  const {
    label: name,
    amount: price,
    photo_url: photoUrl,
    description,
    stripe_price_id: stripePriceId,
    id,
    setItems,
    nbrInCart,
  } = props;
  const amount = useFormInput(nbrInCart);

  const dispatchCart = newCart => {
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: newCart,
    });
  };

  const addItem = async () => {
    const newCart = await addCartItem({
      stripe_price_id: stripePriceId,
      entity_id: id,
    });
    setItems(newCart);
    dispatchCart(newCart);
    amount.setValue(oldValue => oldValue + 1);
  };

  const removeItem = async () => {
    const newCart = await removeCartItemInstance(id);
    setItems(newCart);
    dispatchCart(newCart);
    setDeletedIds([...deletedIds, id]);
    amount.setValue(oldValue => Math.max(0, oldValue - 1));
  };

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
        <div className={styles.cartButton}>
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
      </CardContent>
    </Paper>
  );
}
