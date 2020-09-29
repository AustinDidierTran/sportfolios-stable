import React from 'react';
import { useTranslation } from 'react-i18next';

import { MessageAndButtons } from '../../components/Custom';
import {
  STATUS_ENUM,
  REJECTION_ENUM,
} from '../../../../common/enums';
import { goTo, ROUTES } from '../../actions/goTo';
import { useQuery } from '../../hooks/queries';

export default function RegistrationStatus() {
  const { t } = useTranslation();

  const { reason, status } = useQuery();

  const goToCart = () => {
    goTo(ROUTES.cart);
  };

  const returnHome = () => {
    goTo(ROUTES.home);
  };

  let values = {};

  switch (status) {
    case STATUS_ENUM.ACCEPTED:
      values = {
        message: t('registration_accepted'),
        onClick: goToCart,
        button: t('cart'),
        endIcon: 'ShoppingCart',
      };
      break;
    case STATUS_ENUM.PENDING:
      values = {
        message: t('registration_pending'),
        onClick: returnHome,
        button: t('Home'),
        endIcon: 'Home',
      };
      break;
    case STATUS_ENUM.REFUSED:
      if (reason === REJECTION_ENUM.NO_REMAINING_SPOTS) {
        values = {
          message: t('no_remaining_spots'),
          onClick: returnHome,
          button: t('Home'),
          endIcon: 'Home',
        };
      } else {
        values = {
          message: t('registration_refused'),
          onClick: returnHome,
          button: t('Home'),
          endIcon: 'Home',
        };
      }
      break;
    default:
      values = {
        message: null,
        onClick: null,
        button: null,
        endIcon: null,
      };
  }

  const buttons = [
    {
      name: values.button,
      onClick: values.onClick,
      endIcon: values.endIcon,
      color: 'primary',
    },
  ];

  return (
    <MessageAndButtons buttons={buttons} message={values.message} />
  );
}
