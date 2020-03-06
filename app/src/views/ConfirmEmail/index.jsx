import React from 'react';

import { Container } from '../../components/MUI';
import styles from './ConfirmEmail.module.css';
import { API_BASE_URL } from '../../../../conf';
import history from '../../stores/history';

export default function ConfirmEmail(props) {
  const { match: { params: { token } } } = props;

  const confirmEmail = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/confirmEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token
      })
    });

    if (res.status < 300) {
      // Success!
      history.push('/confirmEmailSuccess');
    } else {
      // Failure...
      history.push('/confirmEmailFailure');
    }
  }

  React.useEffect(() => {
    confirmEmail()
  }, []);

  return (
    <div className={styles.main}>
      <Container>
        <p>
          Hey, we are now trying to confirm your email, please wait a moment...
        </p>
      </Container>
    </div>
  );
}
