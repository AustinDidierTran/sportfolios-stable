import React from 'react';

import { Container } from '../../components/MUI';
import styles from './ConfirmationEmailSent.module.css';

export default function ConfirmationEmailSent(props) {
  const {
    match: {
      params: { email },
    },
  } = props;

  return (
    <div className={styles.main}>
      <Container>
        <p>
          An email has just been sent to {email}. Please, go look at
          your inbox to confirm your email.
        </p>
      </Container>
    </div>
  );
}
