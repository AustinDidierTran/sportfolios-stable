import React, { useEffect } from 'react';

import styles from './UserSettings.module.css';

import BasicInfo from './BasicInfo';
import ChangePassword from './ChangePassword';
import Disconnect from './Disconnect';
import Email from './Email';
import { Container } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';

export default function UserSettings() {
  useEffect(() => {
    document.title = formatPageTitle('Settings');
  }, []);

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
