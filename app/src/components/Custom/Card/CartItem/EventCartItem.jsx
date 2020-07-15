import React, { useContext } from 'react';

import styles from './CartItem.module.css';

import { Typography } from '../../../MUI';
import { Paper, Button } from '../..';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { formatPrice } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { Store, ACTION_ENUM } from '../../../../Store';

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

export default function EventCartItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    setItems,
    id,
    metadata: {
      team: { name: teamName },
    },
  } = props;

  const dispatchCart = newCart => {
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: newCart,
    });
  };

  const removeItem = async () => {
    const newCart = await removeCartItemInstance(id);
    setItems(newCart);
    dispatchCart(newCart);
  };

  return (
    <Paper>
      {photoUrl ? (
        <CardMedia className={styles.media} image={photoUrl} />
      ) : (
        <CardMedia
          className={styles.media}
          image={
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200715-olixr-8317ff33-3b04-49a1-afd3-420202cddf73'
          }
        />
      )}
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {teamName}
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
          {`${description} (${name})`}
        </Typography>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          className={styles.button}
          endIcon="Delete"
          style={{ margin: '8px' }}
          onClick={removeItem}
        >
          {t('delete')}
        </Button>
      </CardContent>
    </Paper>
  );
}
