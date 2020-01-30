import React from 'react';

import styles from './ConfirmationEmailSent.module.css';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: 32,
    maxWidth: 534,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  loginButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  linksContainer: {
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
  },
}));

const BASE_URL = 'http://localhost:1337';

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
