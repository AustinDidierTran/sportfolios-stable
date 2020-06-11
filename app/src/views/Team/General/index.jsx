import React from 'react';

import TeamHistory from './TeamHistory';
import Roster from './Roster';

import { Container } from '../../../components/MUI';

import styles from './Self.module.css';

export default function selfProfile() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <Roster />
        <TeamHistory />
      </Container>
    </div>
  );
}
