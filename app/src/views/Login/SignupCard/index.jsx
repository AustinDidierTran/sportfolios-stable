import React from 'react';

import styles from './SignupCard.module.css';
import { Button } from '../../../components/MUI';

import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function SignupCard() {
  const { t } = useTranslation();
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => goTo(ROUTES.signup)}
      className={styles.button}
      style={{ borderWidth: '2px' }}
    >
      {t('signup')}
    </Button>
  );
}
