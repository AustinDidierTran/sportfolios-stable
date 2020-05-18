import React from 'react';

import BasicInfos from './BasicInfos';
import AthleteHistory from './AthleteHistory';
import Organizations from './Organizations';
import Teams from './Teams';
import Funding from './Funding';

import { Container, Typography } from '../../../../components/MUI';

import styles from './Self.module.css';
import { useTranslation } from 'react-i18next';

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
          {t('Profil')}
        </Typography>
        <BasicInfos />
        <Funding />
        <Organizations />
        <Teams />
        <AthleteHistory />
      </Container>
    </div>
  );
}
