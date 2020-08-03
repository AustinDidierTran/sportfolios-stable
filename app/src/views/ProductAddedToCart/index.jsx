import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import { MessageAndButtons } from '../../components/Custom';
import { useQuery } from '../../hooks/queries';
import { goTo, ROUTES } from '../../actions/goTo';

export default function ProductAddedToCart() {
  const { name, total, amount } = useQuery();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('product_added_to_cart'));
  }, []);

  const goToCart = () => {
    goTo(ROUTES.cart);
  };

  const goToHome = () => {
    goTo(ROUTES.home);
  };

  const buttons = [
    {
      name: t('home'),
      endIcon: 'Home',
      color: 'default',
      onClick: goToHome,
    },
    {
      name: t('cart'),
      endIcon: 'ShoppingCart',
      color: 'primary',
      onClick: goToCart,
    },
  ];

  return (
    <MessageAndButtons
      buttons={buttons}
      message={t('your_item_has_been_added_to_cart', {
        name,
        amount,
        total,
      })}
    />
  );
}
