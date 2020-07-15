import React from 'react';

import styles from './CartItem.module.css';

import { Typography } from '../../../MUI';
import { Paper } from '../..';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
    <Paper>
      <CardMedia className={styles.media} image={photoUrl} />
      <CardContent className={styles.infos}>
        <Typography gutterBottom variant="h5" className={styles.name}>
          {teamName}
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
          {`${description} (${name})`}
        </Typography>
      </CardContent>
    </Paper>
  );
}
