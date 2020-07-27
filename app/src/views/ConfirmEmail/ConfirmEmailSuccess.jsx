import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  IgContainer,
  MessageAndButton,
} from '../../components/Custom';

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
    }, 5000);
  }, []);

  if (successRoute) {
    return (
      <IgContainer>
        <MessageAndButton
          button={t('go_to_event')}
          onClick={() => {
            goTo(successRoute);
          }}
          endIcon="Event"
          message={`${t('email_confirm_success')} ${t(
            'redirect_to_success_route',
          )}`}
        ></MessageAndButton>
      </IgContainer>
    );
  }

  return (
    <IgContainer>
      <MessageAndButton
        button={t('home')}
        onClick={() => {
          goTo(ROUTES.home);
        }}
        endIcon="Home"
        message={`${t('email_confirm_success')} ${t(
          'redirect_to_home',
        )}`}
      ></MessageAndButton>
    </IgContainer>
  );
}
