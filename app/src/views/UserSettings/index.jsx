import React from 'react';

import { useTranslation } from 'react-i18next';

import styles from './UserSettings.module.css';

import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import Email from './Email';
import { Container } from '../../components/MUI';

export default function UserSettings() {
  const { t } = useTranslation();

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <BasicInfo />
        <ChangePassword />
        <Email />
      </Container>
    </div>
  );
}
