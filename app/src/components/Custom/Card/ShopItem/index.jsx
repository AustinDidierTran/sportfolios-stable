import React, { useState } from 'react';

import styles from './Item.module.css';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../../MUI';
import { Button, Paper } from '../..';

import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../../Store';
import api from '../../../../actions/api';

const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

const addCartItem = async params => {
  const { data: newCart } = await api('/api/shop/addCartItem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return newCart;
};

export default function Item(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { dispatch } = useContext(Store);
  const {
    name,
    price,
    photoUrl,
    description,
    stripe_price_id,
  } = props;
  const classes = useStyles();
  const [inCart, setInCart] = useState(false);

  const handleClick = async () => {
    if (!inCart) {
      const cartParams = {
        stripe_price_id: stripe_price_id,
        entity_id: id,
      };
      const newCart = addCartItem(cartParams);

      dispatch({
        type: ACTION_ENUM.UPDATE_CART,
        payload: newCart,
      });
    }
    setInCart(!inCart);
  };
  return (
    <Paper className={classes.root}>
      <CardMedia className={classes.media} image={photoUrl} />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="h5" className={styles.price}>
          {price}
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          component="p"
          className={styles.description}
        >
          {description}
        </Typography>
        {inCart ? (
          <Button
            size="small"
            color="default"
            endIcon="RemoveShoppingCart"
            onClick={handleClick}
            className={styles.cart}
          >
            {t('added_to_cart')}
          </Button>
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
