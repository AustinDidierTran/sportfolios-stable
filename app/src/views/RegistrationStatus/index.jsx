import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../components/MUI';

import styles from './RegistrationStatus.module.css';
import { Paper, Button } from '../../components/Custom';
import { REGISTRATION_STATUS_ENUM } from '../../../../common/enums';
import { useParams } from 'react-router-dom';
import { goTo, ROUTES } from '../../actions/goTo';

export default function RegistrationStatus() {
  const { t } = useTranslation();

  const { status } = useParams();

  const goToCart = () => {
    goTo(ROUTES.cart);
  };

  const returnHome = () => {
    goTo(ROUTES.home);
  };

  let values = {};

  switch (status) {
    case REGISTRATION_STATUS_ENUM.ACCEPTED:
      values = {
        message:
          'Congratulation you have been accepted to the event you can now go to your cart to pay the registration for your team!',
        onClick: goToCart,
        button: t('cart'),
        endIcon: 'ShoppingCart',
      };
      break;
    case REGISTRATION_STATUS_ENUM.PENDING:
      values = {
        message:
          'Your acceptation is currently pending, you will receive an email when the event will accept your registration',
        onClick: returnHome,
        button: t('Home'),
        endIcon: 'Home',
      };
      break;
    case REGISTRATION_STATUS_ENUM.REFUSED:
      values = {
        message:
          'Sorry, your team is not elligible for this event your registration has been refused',
        onClick: returnHome,
        button: t('Home'),
        endIcon: 'Home',
      };
      break;
    default:
      values = {
        message: null,
        onClick: null,
        button: null,
        endIcon: null,
      };
  }

  return (
    <Paper title={t('acceptation')}>
      <Typography style={{ margin: '8px' }}>
        {values.message}
      </Typography>
      <Button
        classname={styles.button}
        size="small"
        variant="contained"
        endIcon={values.endIcon}
        style={{
          margin: '8px',
        }}
        onClick={values.onClick}
      >
        {values.button}
      </Button>
    </Paper>
  );
}
