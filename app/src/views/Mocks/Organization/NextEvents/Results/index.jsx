import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';

import styles from './Results.module.css';

import { Container, Button } from '../../../../../components/MUI';
import { TABS_ENUM } from '../../../Event';

export default function Results(props) {
  const { t } = useTranslation();

  const handleClick = () => {
    goTo(ROUTES.mockEvent, { openTab: TABS_ENUM.SCHEDULE });
  };

  return (
    <Container className={styles.container}>
      <Button
        variant="contained"
        onClick={handleClick}
        color="primary"
        className={styles.button}
      >
        {t('results')}
      </Button>
    </Container>
  );
}
