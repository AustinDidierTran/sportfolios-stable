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
        <BasicInfos />
        <Funding />
        <Organizations />
        <Teams />
        <AthleteHistory />
      </Container>
    </div>
  );
}
