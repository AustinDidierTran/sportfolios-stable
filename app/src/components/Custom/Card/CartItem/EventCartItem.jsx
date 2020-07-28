import React from 'react';

import styles from './CartItem.module.css';

import { Typography } from '../../../MUI';
import { Paper, CardMedia } from '../..';

import CardContent from '@material-ui/core/CardContent';
import { formatPrice } from '../../../../utils/stringFormats';

export default function EventCartItem(props) {
  const {
    label: name,
    amount: price,
    photoUrl,
    description,
    metadata: {
      team: { name: teamName },
    },
  } = props;

  return (
    <Paper className={styles.paper}>
      <CardMedia className={styles.media} photoUrl={photoUrl} />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {`${description} (${name})`}
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
          {teamName}
        </Typography>
      </CardContent>
    </Paper>
  );
}
