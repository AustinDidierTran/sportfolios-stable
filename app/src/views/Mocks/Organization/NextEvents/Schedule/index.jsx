import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Schedule.module.css';

import { Container, Button } from '../../../../../components/MUI';

export default function Schedule(props) {
  const { t } = useTranslation();

  return (
    <Container className={styles.container}>
      <Button
        variant="contained"
        color="primary"
        className={styles.button}
      >
        {t('schedule')}
      </Button>
    </Container>
  );
}
