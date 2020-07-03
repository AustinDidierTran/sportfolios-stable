import React from 'react';

import styles from './Item.module.css';

import { Typography } from '../../../MUI';
import { Paper } from '../..';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useParams } from 'react-router-dom';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function Item(props) {
  const { id } = useParams();
  const {
    label: name,
    amount: price,
    photo_url: photoUrl,
    description,
    stripe_price_id,
  } = props;

  const onPaperClick = () => {
    goTo(ROUTES.shopDetails, { id, stripeId: stripe_price_id });
  };

  return (
    <Paper className={styles.root} onClick={onPaperClick}>
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
      </CardContent>
    </Paper>
  );
}
