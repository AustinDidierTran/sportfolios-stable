import React, { useContext, useMemo, useState } from 'react';

import styles from './ShopDetails.module.css';
import { useTranslation } from 'react-i18next';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { useParams } from 'react-router-dom';
import api from '../../actions/api';
import {
  formatRoute,
  goTo,
  ROUTES,
  goToAndReplace,
} from '../../actions/goTo';
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
import { Store, ACTION_ENUM } from '../../Store';

export default function ShopDetails() {
  const {
    state: { authToken },
    dispatch,
  } = useContext(Store);
  const { t } = useTranslation();
  const { id, stripePriceId } = useParams();
  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {
    label: name,
    amount: price,
    photoUrl,
    metadata,
    description,
  } = item;

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
      const isAuthenticated = Boolean(authToken);

      if (!isAuthenticated) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('you_need_to_create_an_account'),
          severity: 'info',
        });
        goToAndReplace(ROUTES.login, null, {
          successRoute: formatRoute(ROUTES.shopDetails, {
            id,
            stripePriceId,
          }),
        });
        return;
      }

      const { quantity, size } = values;
      const metadata = {};

      if (size) {
        metadata.size = size;
      }

      /* eslint-disable-next-line */
      console.log({ stripePriceId, metadata, quantity });
      const res = await api('/api/shop/addCartItem', {
        method: 'POST',
        body: JSON.stringify({
          stripePriceId,
          metadata,
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

  const sizeOptions = useMemo(() => {
    if (metadata && metadata.sizes) {
      const sizes = JSON.parse(metadata.sizes);
      formik.setFieldValue('size', sizes[0]);
      return sizes.map(size => ({
        value: size,
        display: t(`sizes_enum_${size.toLowerCase()}`),
      }));
    }

    return null;
  }, [metadata]);

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
            <Typography variant="h6" className={styles.price}>
              {formatPrice(price)}
            </Typography>
            <Typography
              variant="h7"
              color="textSecondary"
              component="p"
              className={styles.description}
            >
              {description}
            </Typography>
            {sizeOptions ? (
              <div className={styles.sizes}>
                <Select
                  label={t('size')}
                  formik={formik}
                  namespace="size"
                  options={sizeOptions}
                />
              </div>
            ) : (
              <></>
            )}
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
