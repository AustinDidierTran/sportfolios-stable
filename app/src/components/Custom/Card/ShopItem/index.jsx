import React from 'react';

import styles from './Item.module.css';

import { Typography } from '../../../MUI';
import { Paper } from '../..';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useParams } from 'react-router-dom';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { formatPrice } from '../../../../utils/stringFormats';

export default function ShopItem(props) {
  const { id } = useParams();
  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    stripePriceId,
  } = props;

  const onPaperClick = () => {
    goTo(ROUTES.shopDetails, { id, stripePriceId });
  };

  return (
    <Paper className={styles.root} onClick={onPaperClick}>
      <CardMedia className={styles.media} image={photoUrl} />
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
      </CardContent>
    </Paper>
  );
}
