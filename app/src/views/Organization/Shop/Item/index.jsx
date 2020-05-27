import React, { useState } from 'react';

import styles from './Item.module.css';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../../../components/MUI';
import { Button, Paper } from '../../../../components/Custom';

import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

export default function Shop(props) {
  const { t } = useTranslation();

  const { name, price, photoUrl, description } = props;

  const classes = useStyles();

  const [inCart, setInCart] = useState(false);

  const handleClick = () => {
    setInCart(!inCart);
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
          variant="h7"
          color="textSecondary"
          component="p"
          className={styles.description}
        >
          {description}
        </Typography>
        {inCart ? (
          <Button
            size="small"
            color="default"
            endIcon="RemoveShoppingCart"
            onClick={handleClick}
            className={styles.cart}
          >
            {t('added_to_cart')}
          </Button>
        ) : (
          <Button
            size="small"
            color="primary"
            endIcon="AddShoppingCart"
            onClick={handleClick}
            className={styles.cart}
          >
            {t('add_to_cart')}
          </Button>
        )}
      </CardContent>
    </Paper>
  );
}
