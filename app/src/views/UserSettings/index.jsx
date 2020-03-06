import React from 'react';

import styles from './UserSettings.module.css';

import ChangePassword from '../../components/UserSettings/ChangePassword';
import { Typography, Container } from '../../components/MUI';

export default function Login() {
  return (
    <div className={styles.main}>
      <Container>
        <Typography variant='h3' className={styles.title} style={{ marginTop: 32 }}>User settings</Typography>
        <ChangePassword />
      </Container>
    </div>
  );
}
