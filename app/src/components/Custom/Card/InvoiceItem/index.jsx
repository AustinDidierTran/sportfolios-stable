import React from 'react';

import styles from './Item.module.css';

import { Typography } from '../../../MUI';
import { Paper } from '../..';

import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

export default function Item(props) {
  const {
    label: name,
    amount: price,
    photo_url: photoUrl,
    description,
  } = props;
  const classes = useStyles();

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
      </CardContent>
    </Paper>
  );
}
