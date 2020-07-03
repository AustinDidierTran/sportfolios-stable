import React, { useContext, useEffect } from 'react';

import styles from './CartItem.module.css';

import { Typography, TextField } from '../../../MUI';
import { Paper } from '../..';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { formatRoute } from '../../../../actions/goTo';
import { useFormInput } from '../../../../hooks/forms';

const addCartItem = async params => {
  await api('/api/shop/addCartItem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return getCartItems();
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

const updateCartItems = async params => {
  await api('/api/shop/updateCartItems', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return getCartItems();
};

const getCartItems = async () => {
  const { data: cartItems } = await api(
    '/api/shop/getCartItemsOrdered',
  );
  return cartItems;
};

export default function Item(props) {
  const { dispatch } = useContext(Store);
  const {
    label: name,
    amount: price,
    photo_url: photoUrl,
    description,
    stripe_price_id: stripePriceId,
    id,
    setItems,
    nbInCart,
  } = props;
  const amount = useFormInput(nbInCart);

  const dispatchCart = newCart => {
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: newCart,
    });
  };

  const addItem = async () => {
    const newCart = await addCartItem({
      stripe_price_id: stripePriceId,
      metadata: { buyer_entity_id: 'Buyer_id_hihi' },
    });
    setItems(newCart);
    dispatchCart(newCart);
  };

  const removeItem = async () => {
    const newCart = await removeCartItemInstance(id);
    setItems(newCart);
    dispatchCart(newCart);
  };

  const onNbBlur = async e => {
    const newNbInCart = e.target.value;
    const newCart = await updateCartItems({
      stripe_price_id: stripePriceId,
      nb_in_cart: newNbInCart,
    });
    setItems(newCart);
    dispatchCart(newCart);
  };

  useEffect(() => {
    amount.changeDefault(nbInCart);
  }, [nbInCart]);

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
      </CardContent>
    </Paper>
  );
}
