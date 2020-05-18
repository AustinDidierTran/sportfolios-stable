import React from 'react';

import { Container, Typography } from '../../../components/MUI';

import styles from './Organization.module.css';
import { useTranslation } from 'react-i18next';
import NextEvents from './NextEvents';
import Shop from './Shop';

export default function selfProfile(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <Typography
        variant="h3"
        className={styles.title}
        style={{ marginTop: 24 }}
      >
        {t('organization')}
      </Typography>
      <Container className={styles.container}>
        <BasicInfos />
        <NextEvents />
        <Shop />
      </Container>
    </div>
  );
}
