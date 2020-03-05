import React from 'react';

import styles from './UserSettings.module.css';

import ChangePassword from '../../components/UserSettings/ChangePassword';

export default function Login() {
  return (
    <div className={styles.main}>
      <ChangePassword />
    </div>
  );
}
