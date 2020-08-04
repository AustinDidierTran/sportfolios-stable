import React, { useState } from 'react';

import styles from './ShopDetails.module.css';
import { useTranslation } from 'react-i18next';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import { formatRoute, goTo, ROUTES } from '../../actions/goTo';
import { Typography } from '../../components/MUI';
import {
  Button,
  Paper,
  IgContainer,
  Select,
} from '../../components/Custom';
import { useEffect } from 'react';
import { formatPrice } from '../../utils/stringFormats';
import { useFormik } from 'formik';
import { CircularProgress } from '@material-ui/core';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../Store';

export default function ShopDetails() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const { stripePriceId } = useParams();
  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { label: name, amount: price, photoUrl, description } = item;

  const fetchItem = async () => {
    const { data } = await api(
      formatRoute('/api/shop/getItem', null, { id: stripePriceId }),
    );
    setItem(data);
    setIsLoading(false);
  };

  const validate = values => {
    const errors = {};
    const { quantity } = values;

    if (quantity < 1) {
      errors.quantity = t('quantity_cant_be_null');
    }
  };

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { quantity } = values;

      /* eslint-disable-next-line */
      const res = await api('/api/shop/addCartItem', {
        method: 'POST',
        body: JSON.stringify({
          stripePriceId,
          metadata: {},
          quantity,
        }),
      });

      if (res.status === 200) {
        goTo(ROUTES.productAddedToCart, null, {
          amount: quantity,
          name: item.label,
          total: formatPrice(quantity * item.amount),
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          severity: 'error',
          message: t('something_went_wrong'),
        });
      }
    },
  });

  useEffect(() => {
    fetchItem();
  }, [stripePriceId]);

  const quantityOptions = Array(100)
    .fill(0)
    .map((a, index) => ({
      value: index + 1,
      display: index + 1,
    }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!item) {
    // TODO: Return 404 view
    return <></>;
  }

  return (
    <IgContainer>
      <form onSubmit={formik.handleSubmit}>
        <Paper>
          <CardMedia className={styles.media} image={photoUrl} />
          <CardContent className={styles.infos}>
            <Typography
              gutterBottom
              variant="h5"
              className={styles.name}
            >
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
            <div className={styles.quantity}>
              <Select
                label={t('quantity')}
                formik={formik}
                namespace="quantity"
                options={quantityOptions}
              />
            </div>
            <Button
              type="submit"
              size="small"
              color="primary"
              endIcon="AddShoppingCart"
              className={styles.cart}
            >
              {t('add_to_cart')}
            </Button>
          </CardContent>
        </Paper>
      </form>
    </IgContainer>
  );
}
