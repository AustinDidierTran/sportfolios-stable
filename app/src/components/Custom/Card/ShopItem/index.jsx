import React from 'react';

import styles from './ShopItem.module.css';

import { Typography } from '../../../MUI';
import { Paper, Button } from '../..';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useParams } from 'react-router-dom';
import { goTo, ROUTES, formatRoute } from '../../../../actions/goTo';
import { formatPrice } from '../../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';

export default function ShopItem(props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    stripePriceId,
    stripeProductId,
    isEditor,
    update,
  } = props;

  const onPaperClick = () => {
    goTo(ROUTES.shopDetails, { id, stripePriceId });
  };

  const deleteItem = async () => {
    await api(
      formatRoute('/api/stripe/deleteItem', null, {
        stripeProductId,
        stripePriceId,
      }),
      {
        method: 'DELETE',
      },
    );
    update();
  };

  return (
    <Paper className={styles.root}>
      <CardMedia
        className={styles.media}
        image={photoUrl}
        onClick={onPaperClick}
      />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {name}
        </Typography>
        <Typography variant="h5" className={styles.price}>
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
        {isEditor ? (
          <Button
            onClick={deleteItem}
            endIcon="Delete"
            color="secondary"
            className={styles.button}
          >
            {t('delete')}
          </Button>
        ) : (
          <></>
        )}
      </CardContent>
    </Paper>
  );
}
