import React from 'react';
import { useTranslation } from 'react-i18next';

import { MessageAndButton } from '../../components/Custom';
import styles from './ConfirmationEmailSent.module.css';
import { goTo, ROUTES } from '../../actions/goTo';

export default function ConfirmationEmailSent(props) {
  const {
    match: {
      params: { email },
    },
  } = props;
  const { t } = useTranslation();

  const goToLogin = () => {
    goTo(ROUTES.login);
  };

  return (
    <div className={styles.main}>
      <MessageAndButton
        button={t('go_back_to_login')}
        onClick={goToLogin}
        endIcon={'Undo'}
        message={t('email_confirmed', { email })}
      />
    </div>
  );
}
