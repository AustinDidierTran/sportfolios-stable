import React from 'react';

import styles from './Item.module.css';

import { Typography } from '../../../../components/MUI';
import { Paper } from '../../../../components/Custom';

import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

export default function Item(props) {
  const { name, price, photoUrl, description } = props;
  const classes = useStyles();

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
      </CardContent>
    </Paper>
  );
}
