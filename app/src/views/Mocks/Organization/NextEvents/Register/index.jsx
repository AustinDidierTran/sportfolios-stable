import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';

import styles from './Register.module.css';

import { Container, Button } from '../../../../../components/MUI';
import { TABS_ENUM } from '../../../Event';

export default function Register(props) {
  const { t } = useTranslation();

  const handleClick = () => {
    goTo(ROUTES.mockEvent, { openTab: TABS_ENUM.REGISTER });
  };

  return (
    <Container className={styles.container}>
      <Button
        variant="contained"
        onClick={handleClick}
        className={styles.button}
        color="primary"
      >
        {t('registration')}
      </Button>
    </Container>
  );
}
