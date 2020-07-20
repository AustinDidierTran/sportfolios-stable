import React from 'react';

import styles from './SignupCard.module.css';
import { Button } from '../../../components/MUI';

import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function SignupCard(props) {
  const { t } = useTranslation();
  const { successRoute } = props;
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => goTo(ROUTES.signup, null, { successRoute })}
      className={styles.button}
      style={{ borderWidth: '2px' }}
    >
      {t('signup')}
    </Button>
  );
}
