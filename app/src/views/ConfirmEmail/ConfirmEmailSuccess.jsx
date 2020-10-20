import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { MessageAndButtons } from '../../components/Custom';

import { goTo, ROUTES } from '../../actions/goTo';
import { useQuery } from '../../hooks/queries';

export default function ConfirmEmailSuccess() {
  const { t } = useTranslation();
  const { successRoute } = useQuery();

  useEffect(() => {
    setTimeout(() => {
      if (successRoute) {
        goTo(successRoute);
      } else {
        goTo(ROUTES.home);
      }
    }, 3000);
  }, []);

  const successButtons = [
    {
      name: t('go_to_page'),
      endIcon: 'ExitToApp',
      onClick: () => {
        goTo(successRoute);
      },
      color: 'primary',
    },
  ];

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

  if (successRoute) {
    return (
      <MessageAndButtons
        buttons={successButtons}
        message={`${t('email_confirm_success')} ${t(
          'redirect_to_success_route',
        )}`}
      />
    );
  }

  return (
    <MessageAndButtons
      buttons={buttons}
      message={`${t('email_confirm_success')} ${t(
        'redirect_to_home',
      )}`}
    />
  );
}
