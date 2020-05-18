import React from 'react';

import { Container, Typography } from '../../../components/MUI';

import styles from './Organization.module.css';
import { useTranslation } from 'react-i18next';
import BasicInfos from './BasicInfos';
<<<<<<< Updated upstream
=======
import NextEvents from './NextEvents';
import Shop from './Shop';
>>>>>>> Stashed changes

export default function selfProfile(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <Typography
          variant="h3"
          className={styles.title}
          style={{ marginTop: 24 }}
        >
          {t('organization')}
        </Typography>
        <BasicInfos />
<<<<<<< Updated upstream
=======
        <NextEvents />
        <Shop />
>>>>>>> Stashed changes
      </Container>
    </div>
  );
}
