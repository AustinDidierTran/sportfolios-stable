import React from 'react';

import TeamHistory from './TeamHistory';
import Roster from './Roster';

import { Container, Typography } from '../../../components/MUI';

import styles from './Self.module.css';
import { useTranslation } from 'react-i18next';

export default function selfProfile(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <Roster />
        <TeamHistory />
      </Container>
    </div>
  );
}
