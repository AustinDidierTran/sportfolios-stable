import React from 'react';

import { Container } from '../../components/Custom';
import styles from './ConfirmEmail.module.css';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';

export default function ConfirmEmail(props) {
  const {
    match: {
      params: { token },
    },
  } = props;

  const confirmEmail = async () => {
    const res = await api('/api/auth/confirmEmail', {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    });

    if (res.status < 300) {
      // Success!
      goTo(ROUTES.confirmEmailSuccess);
    } else {
      // Failure...
      goTo(ROUTES.confirmEmailFailure);
    }
  };

  React.useEffect(() => {
    confirmEmail();
  }, []);

  return (
    <div className={styles.main}>
      <Container>
        <p>
          Hey, we are now trying to confirm your email, please wait a
          moment...
        </p>
      </Container>
    </div>
  );
}
