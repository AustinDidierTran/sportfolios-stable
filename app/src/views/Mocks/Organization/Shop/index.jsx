import React, { useState } from 'react';

import styles from './Shop.module.css';

import { Typography, Card } from '../../../../components/MUI';
import { Button, Icon } from '../../../../components/Custom';

import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Container } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: 'auto',
  },
  media: {
    height: 200,
  },
});

export default function Shop(props) {
  const classes = useStyles();

  const [inCart, setInCart] = useState(false);

  const handleClick = () => {
    setInCart(!inCart);
  };

  return (
    //First Item
    <Container className={styles.items}>
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image="http://www.sherbrookeultimate.org/wp-content/uploads/2018/11/T-shirtVertLogoBlanc.png"
          title="Chandail vert"
        />
        <CardContent className={styles.infos}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={styles.name}
          >
            T-shirts de l'AUS
          </Typography>
          <Typography variant="h6" className={styles.price}>
            245$
          </Typography>
          <Typography
            variant="h7"
            color="textSecondary"
            component="p"
            className={styles.description}
          >
            Chandail disponible en trois couleurs: Noir, Blanc et Vert
          </Typography>
          {inCart ? (
            <Button
              size="small"
              color="default"
              endIcon="RemoveShoppingCart"
              onClick={handleClick}
              className={styles.cart}
            >
              Added to cart
            </Button>
          ) : (
            <Button
              size="small"
              color="primary"
              endIcon="AddShoppingCart"
              onClick={handleClick}
              className={styles.cart}
            >
              Add to cart
            </Button>
          )}
        </CardContent>
      </Card>
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image="http://www.sherbrookeultimate.org/wp-content/uploads/2018/11/T-shirtVertLogoBlanc.png"
          title="Chandail vert"
        />
        <CardContent className={styles.infos}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={styles.name}
          >
            T-shirts de l'AUS
          </Typography>
          <Typography variant="h6" className={styles.price}>
            245$
          </Typography>
          <Typography
            variant="h7"
            color="textSecondary"
            component="p"
            className={styles.description}
          >
            Chandail disponible en trois couleurs: Noir, Blanc et Vert
          </Typography>
          {inCart ? (
            <Button
              size="small"
              color="default"
              endIcon="RemoveShoppingCart"
              onClick={handleClick}
              className={styles.cart}
            >
              Added to cart
            </Button>
          ) : (
            <Button
              size="small"
              color="primary"
              endIcon="AddShoppingCart"
              onClick={handleClick}
              className={styles.cart}
            >
              Add to cart
            </Button>
          )}
        </CardContent>
      </Card>
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image="http://www.sherbrookeultimate.org/wp-content/uploads/2018/11/T-shirtVertLogoBlanc.png"
          title="Chandail vert"
        />
        <CardContent className={styles.infos}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={styles.name}
          >
            T-shirts de l'AUS
          </Typography>
          <Typography variant="h6" className={styles.price}>
            245$
          </Typography>
          <Typography
            variant="h7"
            color="textSecondary"
            component="p"
            className={styles.description}
          >
            Chandail disponible en trois couleurs: Noir, Blanc et Vert
          </Typography>
          {inCart ? (
            <Button
              size="small"
              color="default"
              endIcon="RemoveShoppingCart"
              onClick={handleClick}
              className={styles.cart}
            >
              Added to cart
            </Button>
          ) : (
            <Button
              size="small"
              color="primary"
              endIcon="AddShoppingCart"
              onClick={handleClick}
              className={styles.cart}
            >
              Add to cart
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
