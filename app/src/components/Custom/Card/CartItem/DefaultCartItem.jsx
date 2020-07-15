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
import { formatPrice } from '../../../../utils/stringFormats';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

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
      cartInstanceId,
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

export default function DefaultCartItem(props) {
  const { dispatch } = useContext(Store);
  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    stripePriceId,
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
      stripePriceId,
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
      stripePriceId,
      nbInCart: newNbInCart,
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
        <Typography variant="h6" className={styles.price}>
          {formatPrice(price)}
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          component="p"
          className={styles.description}
        >
          {description}
        </Typography>
        <IconButton
          color="primary"
          onClick={removeItem}
          className={styles.minus}
        >
          <RemoveIcon />
        </IconButton>
        <TextField
          className={styles.quantity}
          {...amount.inputProps}
          onBlur={onNbBlur}
          inputProps={{
            min: 0,
            style: { textAlign: 'center' },
          }}
        />
        <IconButton
          color="primary"
          onClick={addItem}
          className={styles.plus}
        >
          <AddIcon />
        </IconButton>
      </CardContent>
    </Paper>
  );
}
