import React from 'react';

import Container from '@material-ui/core/Container';
import styles from './ConfirmEmail.module.css';

export default function ConfirmEmail(props) {
  const { match: { params: { token } } } = props;

  return (
    <div className={styles.main}>
      <Container>
        <p>
          Hey, we are now trying to confirm your email! {token}
        </p>
      </Container>
    </div>
  );
}
