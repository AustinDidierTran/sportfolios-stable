import React from 'react';

import styles from './Login.module.css';

import Card from '@material-ui/core/Card';
import TextField from '../../components/TextField/TextField';

export default function Login() {
  return (
    <div className={styles.main}>
      <h3 className={styles.title}>Login</h3>
      <Card>
        <TextField placeholder="username" />
      </Card>
    </div>
  );
}
