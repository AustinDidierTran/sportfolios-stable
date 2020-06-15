import React from 'react';

import styles from './UserSettings.module.css';

import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import Disconnect from './Disconnect';
import Email from './Email';
import People from './People';
import { Container } from '../../components/Custom';

export default function UserSettings() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <BasicInfo />
        <ChangePassword />
        <Email />
        <Disconnect />
        <People />
      </Container>
    </div>
  );
}
