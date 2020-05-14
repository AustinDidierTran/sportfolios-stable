import React from 'react';

import { Container, Typography } from '../../../components/MUI';

import styles from './Organization.module.css';
import { useTranslation } from 'react-i18next';
import BasicInfos from './BasicInfos';

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
      </Container>
    </div>
  );
}
