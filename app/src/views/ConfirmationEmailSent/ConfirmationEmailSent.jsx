import React from 'react';

import styles from './ConfirmationEmailSent.module.css';

import { makeStyles } from '@material-ui/core/styles';

export default function ConfirmationEmailSent() {
  return (
    <div className={styles.main}>
      <p>
        An email has just been sent. Please, go look at your inbox to
        confirm your email
      </p>
    </div>
  );
}
