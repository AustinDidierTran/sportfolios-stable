import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Register.module.css';

import { Container, Button } from '../../../../../components/MUI';

export default function Register(props) {
  const { t } = useTranslation();

  return (
    <Container className={styles.container}>
      <Button
        variant="contained"
        color="primary"
        className={styles.button}
      >
        {t('register')}
      </Button>
    </Container>
  );
}
