import React from 'react';

import General from './General';
import { Container } from '../../components/MUI';

import styles from './Main.module.css';

export default function Main() {
  return (
    <Container>
      <div className={styles.main}>
        <General />
      </div>
    </Container>
  );
}
