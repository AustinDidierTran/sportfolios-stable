import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './REGISTER.module.css';

import { Container, Button } from '../../../../../components/MUI';

export default function Register(props) {
  const { t } = useTranslation();

  const [isMember, setIsMember] = useState(false);

  const handleClick = () => {
    setIsMember(!isMember);
  };

  return (
    <Container className={styles.container}>
      {isMember ? (
        <Button
          variant="contained"
          onClick={handleClick}
          className={styles.button}
        >
          {t('registered')}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          className={styles.button}
        >
          {t('register')}
        </Button>
      )}
    </Container>
  );
}
