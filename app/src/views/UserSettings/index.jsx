import React from 'react';

import { useTranslation } from 'react-i18next';

import styles from './UserSettings.module.css';

import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import Disconnect from './Disconnect';
import Email from './Email';
import { Container } from '../../components/Custom';

export default function UserSettings() {
  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <BasicInfo />
        <ChangePassword />
        <Email />
        <Disconnect />
      </Container>
    </div>
  );
}
