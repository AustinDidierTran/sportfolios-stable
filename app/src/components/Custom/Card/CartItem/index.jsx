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

const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

const removeCartItem = async params => {
  const { data: newCart } = await api('/api/shop/removeCartItem', {
    method: 'DELETE',
    body: JSON.stringify(params),
  });
  return newCart;
};

export default function Item(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const {
    name,
    price,
    photoUrl,
    description,
    stripe_price_id,
  } = props;
  const classes = useStyles();

  const handleClick = async () => {
    const newCart = removeCartItem({
      stripe_price_id: stripe_price_id,
    });
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
