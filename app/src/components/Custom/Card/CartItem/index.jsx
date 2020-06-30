import React from 'react';

import styles from './Item.module.css';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../../MUI';
import { Button, Paper } from '../..';

import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useContext } from 'react';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { formatRoute } from '../../../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../../../common/enums';

const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

const removeCartItem = async stripe_price_id => {
  await api(
    formatRoute('/api/shop/removeCartItem', null, {
      stripe_price_id,
    }),
    {
      method: 'DELETE',
    },
  );
};

const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems');
  return cartItems;
};

export default function Item(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const {
    label: name,
    amount: price,
    photo_url: photoUrl,
    description,
    stripe_price_id,
    setItems,
  } = props;

  const classes = useStyles();

  const handleClick = async () => {
    await removeCartItem(stripe_price_id);
    const newCart = await getCartItems();
    setItems(
      newCart.length
        ? newCart.map(d => ({
            ...d,
            type: CARD_TYPE_ENUM.CART,
          }))
        : [],
    );
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: newCart,
    });
  };
  return (
    <Paper className={classes.root}>
      <CardMedia className={classes.media} image={photoUrl} />
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
        <Button
          size="small"
          color="default"
          endIcon="RemoveShoppingCart"
          onClick={handleClick}
          className={styles.cart}
        >
          {t('delete')}
        </Button>
      </CardContent>
    </Paper>
  );
}
