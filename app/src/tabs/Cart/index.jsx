import React, { useState, useEffect } from 'react';
import styles from './Cart.module.css';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import {
  CARD_TYPE_ENUM,
  LIST_ITEM_ENUM,
} from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import {
  Button,
  MessageAndButtons,
  List,
  ContainerBottomFixed,
  LoadingSpinner,
  Card,
} from '../../components/Custom';
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
  }, []);

  const updateQuantity = async (quantity, cartItemId) => {
    const { data } = await api('/api/shop/updateCartItems', {
      method: 'POST',
      body: JSON.stringify({
        quantity,
        cartItemId,
      }),
    });
    const { items: itemsProp, total: totalProp } = data;
    setItems(itemsProp);
    setTotal(totalProp.total);
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: data,
    });
  };
  if (isLoading) {
    return <LoadingSpinner />;
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
        withoutIgContainer
      />
    );
  }

  return (
    <>
      <div className={styles.cart}>
        <List
          items={items.map((item, index) => ({
            ...item,
            updateQuantity,
            type: LIST_ITEM_ENUM.CART,
            key: index,
          }))}
        />
        <Card
          items={{
            items,
            total,
          }}
          type={CARD_TYPE_ENUM.CART_SUMMARY}
        />
      </div>
      <ContainerBottomFixed>
        <div className={styles.buttonDiv}>
          <Button
            size="small"
            variant="contained"
            endIcon="Check"
            onClick={() => {
              goTo(ROUTES.checkout);
            }}
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
