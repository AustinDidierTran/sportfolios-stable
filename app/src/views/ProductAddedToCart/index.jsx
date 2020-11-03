import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';

import { MessageAndButtons } from '../../components/Custom';
import { useQuery } from '../../hooks/queries';
import { goTo, ROUTES } from '../../actions/goTo';
import { TABS_ENUM } from '../../../../common/enums';

export default function ProductAddedToCart() {
  const { name, total, amount, id } = useQuery();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('product_added_to_cart'));
  }, []);

  const goToCart = () => {
    goTo(ROUTES.cart);
  };

  const goToShop = () => {
    goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.SHOP });
  };

  const buttons = [
    {
      name: t('back_to_shop'),
      endIcon: 'Store',
      color: 'default',
      onClick: goToShop,
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
