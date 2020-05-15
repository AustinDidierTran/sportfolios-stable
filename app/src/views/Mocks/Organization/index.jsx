import React from 'react';

import { Container, Typography } from '../../../components/MUI';

import styles from './Organization.module.css';
import { useTranslation } from 'react-i18next';
import BasicInfos from './BasicInfos';
import NextEvents from './NextEvents';

export default function selfProfile(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <BasicInfos />
        <NextEvents />
      </Container>
    </div>
  );
}
