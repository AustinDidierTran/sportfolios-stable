import React, { useState, useEffect } from 'react';

import styles from './Cart.module.css';
import api from '../../actions/api';

import { goTo, ROUTES } from '../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import {
  formatPrice,
  formatPageTitle,
} from '../../utils/stringFormats';

import {
  Button,
  MessageAndButtons,
  List,
  ContainerBottomFixed,
  LoadingSpinner,
  IgContainer,
} from '../../components/Custom';
import DefaultCard from '../../components/MUI/Card';
import { Typography } from '../../components/MUI';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../Store';

const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems');
  return cartItems;
};

export default function Cart() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = formatPageTitle(t('cart'));
  }, []);

  const onCheckout = () => {
    goTo(ROUTES.checkout);
  };

  const fetchItems = async () => {
    const data = await getCartItems();
    const { items: itemsProp, total: totalProp } = data;
    setItems(itemsProp);
    setTotal(totalProp);
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: data,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
    updateQuantity();
  }, []);

  const updateQuantity = async (quantity, item) => {
    const { data } = await api('/api/shop/updateCartItems', {
      method: 'POST',
      body: JSON.stringify({
        quantity,
        cartItemId: item.id,
      }),
    });
    const { items: itemsProp, total: totalProp } = data;
    setItems(itemsProp);
    setTotal(totalProp);
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: data,
    });
  };

  if (isLoading) {
    return (
      <IgContainer>
        <LoadingSpinner />
      </IgContainer>
    );
  }

  if (items.length < 1) {
    const buttons = [
      {
        name: t('home'),
        onClick: () => {
          goTo(ROUTES.home);
        },
        endIcon: 'Home',
        color: 'primary',
      },
    ];
    return (
      <MessageAndButtons
        buttons={buttons}
        message={t('cart_empty_go_shop')}
      />
    );
  }

  return (
    <>
      <IgContainer>
        <div className={styles.cart}>
          <List
            items={items.map(item => ({
              ...item,
              updateQuantity,
              type: GLOBAL_ENUM.CART,
            }))}
          />
          <DefaultCard className={styles.defaultCard}>
            <Typography variant="h5" className={styles.typo}>
              {`Total: ${formatPrice(total)}`}
            </Typography>
          </DefaultCard>
        </div>
      </IgContainer>

      <ContainerBottomFixed>
        <div className={styles.buttonDiv}>
          <Button
            size="small"
            variant="contained"
            endIcon="Check"
            onClick={onCheckout}
            style={{ margin: 8 }}
            className={styles.button}
          >
            {t('checkout')}
          </Button>
        </div>
      </ContainerBottomFixed>
    </>
  );
}
