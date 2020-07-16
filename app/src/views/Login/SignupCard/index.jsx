import React from 'react';

import styles from './SignupCard.module.css';
import { Button } from '../../../components/MUI';

import { goTo, ROUTES } from '../../../actions/goTo';

export default function SignupCard() {
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => goTo(ROUTES.signup)}
      className={styles.button}
      style={{ borderWidth: '2px' }}
    >
      SIGNUP
    </Button>
  );
}
