import React from 'react';

import styles from './UserSettings.module.css';

import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import Email from './Email';
import { Typography, Container } from '../../components/MUI';

export default function Login() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <Typography variant='h3' className={styles.title} style={{ marginTop: 32 }}>User settings</Typography>
        <BasicInfo />
        <ChangePassword />
        <Email />
      </Container>
    </div>
  );
}
