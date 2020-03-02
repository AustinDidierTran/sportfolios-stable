import React from 'react';

import Container from '@material-ui/core/Container';
import styles from './ConfirmationEmailSent.module.css';

export default function ConfirmationEmailSent() {
  return (
    <div className={styles.main}>
      <Container>
        <p>
          An email has just been sent. Please, go look at your inbox to
          confirm your email.
      </p>
      </Container>
    </div>
  );
}
